/**
 * UNIVERSO RASTI — Lógica Principal del Prototipo Interactivo
 */

const RastiApp = (() => {
  let state = {
    currentTab: 'inicio',
    modosView: 'islands', // 'islands' (Modo Aventura) | 'familia' (Familia Rasti)
    familiaTab: 'todos',
    customFilter: 'all',
    charZoomed: false,
    charFlipped: false,
    soundEnabled: true,
    parentalConsent: true,
    onboardingStep: 1,
    selectedWorldId: 'espacial',
    selectedMissionNum: 6,
    webcamStream: null,
    currentAudio: null
  };

  // ==========================================================================
  // AUDIO: VOZ ARGENTINA NEURONAL (es-AR) + EFECTOS DE SONIDO
  // ==========================================================================
  function playTone(type = 'click') {
    if (!state.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.5, now + 0.24);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
        osc.start(now);
        osc.stop(now + 0.42);
      } else if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.07);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      // Ignorar si el navegador bloquea audio antes de interacción
    }
  }

  /**
   * Reproduce audio pre-generado con voz neuronal de Argentina (es-AR-ElenaNeural / es-AR-TomasNeural)
   * y si se requiere síntesis dinámica, evita explícitamente voces de España (es-ES).
   */
  function playArgentineVoice(mp3File, fallbackText, onEndCallback) {
    if (state.currentAudio) {
      state.currentAudio.pause();
      state.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (mp3File) {
      const audio = new Audio(`assets/audio/${mp3File}`);
      state.currentAudio = audio;
      audio.onended = () => {
        if (onEndCallback) onEndCallback();
      };
      audio.onerror = () => {
        speakWithLatamVoice(fallbackText, onEndCallback);
      };
      audio.play().catch(() => {
        speakWithLatamVoice(fallbackText, onEndCallback);
      });
      return;
    }

    speakWithLatamVoice(fallbackText, onEndCallback);
  }

  function speakWithLatamVoice(text, onEndCallback) {
    if (!('speechSynthesis' in window) || !text) {
      if (onEndCallback) setTimeout(onEndCallback, 1800);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-AR';
    utter.rate = 1.04;
    utter.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Priorizar es-AR, luego voces latinoamericanas (es-419, es-MX, es-US, es-CO, es-CL, es-UY), excluyendo es-ES
      const arVoice = voices.find(v => v.lang.toLowerCase().includes('es-ar'));
      const latamVoice = voices.find(v =>
        v.lang.toLowerCase().startsWith('es') &&
        !v.lang.toLowerCase().includes('es-es') &&
        !v.name.toLowerCase().includes('spain') &&
        !v.name.toLowerCase().includes('españa')
      );
      if (arVoice) {
        utter.voice = arVoice;
      } else if (latamVoice) {
        utter.voice = latamVoice;
      }
    }

    utter.onend = () => { if (onEndCallback) onEndCallback(); };
    utter.onerror = () => { if (onEndCallback) onEndCallback(); };
    window.speechSynthesis.speak(utter);
  }

  // Toast flotante de feedback visual
  let toastTimer = null;
  function showToast(message, icon = '⭐') {
    const toast = document.getElementById('rasti-toast');
    const iconEl = document.getElementById('toast-icon');
    const msgEl = document.getElementById('toast-message');
    if (!toast) return;
    iconEl.textContent = icon;
    msgEl.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ==========================================================================
  // SIMULADOR DE CREACIÓN DE CUENTA (ONBOARDING AL CARGAR POR PRIMERA VEZ)
  // ==========================================================================
  function renderOnboardingAvatars() {
    const grid = document.getElementById('onb-avatars-grid');
    if (!grid) return;
    const u = RASTI_DATA.user;
    grid.innerHTML = RASTI_DATA.profiles.map(p => `
      <button type="button" class="onb-avatar-choice ${u.avatarId === p.id ? 'selected' : ''}"
              onclick="RastiApp.selectOnboardingAvatar(${p.id})">
        <img src="${p.img}" alt="${p.name}" />
        <span>${p.name}</span>
      </button>
    `).join('');
    syncOnboardingPreview();
  }

  function syncOnboardingPreview() {
    const u = RASTI_DATA.user;
    const p = RASTI_DATA.profiles.find(item => item.id === u.avatarId) || RASTI_DATA.profiles[0];
    const imgEl = document.getElementById('onb-preview-img');
    const nameEl = document.getElementById('onb-preview-name');
    if (imgEl) imgEl.src = p.img;
    if (nameEl) nameEl.textContent = u.displayName || p.name;
  }

  function openOnboarding(force = false) {
    if (force) playTone('pop');
    state.onboardingStep = 1;
    state.parentVerified = false;
    const statusEl = document.getElementById('onb-gate-status');
    if (statusEl) {
      statusEl.textContent = '⏳ Pendiente';
      statusEl.style.color = '#b45309';
    }
    document.querySelectorAll('.onb-gate-btn').forEach(b => b.classList.remove('verified', 'wrong'));
    goOnboardingStep(1);
    renderOnboardingAvatars();
    document.getElementById('onboarding-overlay')?.classList.add('open');
  }

  function verifyOnboardingParent(ans) {
    document.querySelectorAll('.onb-gate-btn').forEach(btn => {
      const val = parseInt(btn.dataset.ans, 10);
      btn.classList.toggle('verified', val === 28 && ans === 28);
      btn.classList.toggle('wrong', val === ans && ans !== 28);
    });
    const statusEl = document.getElementById('onb-gate-status');
    if (ans === 28) {
      state.parentVerified = true;
      playTone('success');
      if (statusEl) {
        statusEl.textContent = '✅ Adulto verificado';
        statusEl.style.color = '#15803d';
      }
      showToast('✅ Verificación de adulto completada.', '🛡️');
    } else {
      state.parentVerified = false;
      playTone('click');
      if (statusEl) {
        statusEl.textContent = '❌ Incorrecto';
        statusEl.style.color = '#dc2626';
      }
      showToast('🔒Acceso restringido: la cuenta debe ser creada por un adulto responsable (7 × 4 = 28).', '👨‍👩‍👧');
    }
  }

  function goOnboardingStep(stepNum) {
    if (stepNum > 1 && !state.parentVerified) {
      playTone('click');
      showToast('🔒 Restringido para padres: verificá primero el acceso de adulto (7 × 4 = 28).', '👨‍👩‍👧');
      return;
    }
    playTone('click');
    state.onboardingStep = stepNum;
    for (let i = 1; i <= 3; i++) {
      document.getElementById(`onb-step-${i}`)?.classList.toggle('active', i === stepNum);
      document.getElementById(`onb-dot-${i}`)?.classList.toggle('active', i === stepNum);
    }
    if (stepNum === 3) {
      renderOnboardingAvatars();
    }
  }

  function updateOnboardingName(val) {
    const clean = (val || '').trim() || 'Leo';
    RASTI_DATA.user.displayName = clean;
    updateTopHud();
  }

  function rollOnboardingAlias() {
    playTone('pop');
    const prefixes = ['Lordlyburrito', 'RastiExplorer', 'SuperBloque', 'AstroDino', 'CapitanCoral', 'TurboCastillo'];
    const num = Math.floor(Math.random() * 89) + 10;
    RASTI_DATA.user.username = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${num}`;
    const preview = document.getElementById('onb-alias-preview');
    if (preview) preview.textContent = `@${RASTI_DATA.user.username}`;
    updateTopHud();
  }

  function selectExactAge(ageVal) {
    const num = Math.max(3, Math.min(14, parseInt(ageVal, 10) || 8));
    RASTI_DATA.user.age = num;
    const group = num <= 6 ? '4-6' : '7-10';
    RASTI_DATA.user.ageGroup = group;

    const inputEl = document.getElementById('onb-input-age');
    if (inputEl && parseInt(inputEl.value, 10) !== num) {
      inputEl.value = num;
    }

    document.querySelectorAll('.onb-age-num-btn').forEach(btn => {
      btn.classList.toggle('selected', parseInt(btn.dataset.age, 10) === num);
    });

    const hintEl = document.getElementById('onb-age-mode-hint');
    if (hintEl) {
      if (num <= 6) {
        hintEl.innerHTML = `👶🔊 <strong>${num} años:</strong> Figuras simples narradas por voz • Comunidad Familia Rasti oculta por edad`;
      } else {
        hintEl.innerHTML = `🧒🚀 <strong>${num} años:</strong> Desafíos de construcción + Comunidad Segura Familia Rasti (+6 años)`;
      }
    }

    document.getElementById('btn-age-7-10')?.classList.toggle('active', group === '7-10');
    document.getElementById('btn-age-4-6')?.classList.toggle('active', group === '4-6');
    updateTopHud();
    playTone('pop');
  }

  function selectOnboardingAge(ageGroup) {
    selectExactAge(ageGroup === '4-6' ? 5 : 8);
  }

  function toggleOnboardingParental() {
    playTone('pop');
    RASTI_DATA.user.parentalConsent = !RASTI_DATA.user.parentalConsent;
    const btn = document.getElementById('onb-parental-toggle');
    if (btn) {
      btn.classList.toggle('active', RASTI_DATA.user.parentalConsent);
      btn.textContent = RASTI_DATA.user.parentalConsent ? '✓ AUTORIZADO' : '🔒 NO AUTORIZADO';
    }
    updateTopHud();
  }

  function toggleOnboardingPublishing() {
    playTone('pop');
    RASTI_DATA.user.publishingEnabled = !RASTI_DATA.user.publishingEnabled;
    const btn = document.getElementById('onb-publishing-toggle');
    if (btn) {
      btn.classList.toggle('active', RASTI_DATA.user.publishingEnabled);
      btn.textContent = RASTI_DATA.user.publishingEnabled ? '✓ HABILITADO' : '🔒 DESHABILITADO';
    }
  }

  function selectOnboardingAvatar(profileId) {
    selectBaseProfile(profileId);
    const input = document.getElementById('onb-input-name');
    if (input) input.value = RASTI_DATA.user.displayName;
    renderOnboardingAvatars();
  }

  function finishOnboarding(targetTab = 'inicio') {
    playTone('success');
    try {
      sessionStorage.setItem('rasti_onboarded', '1');
    } catch (e) {}
    document.getElementById('onboarding-overlay')?.classList.remove('open');
    updateTopHud();
    navigate(targetTab);
    showToast(`¡Bienvenido/a ${RASTI_DATA.user.displayName} a Universo Rasti!`, '🚀');
  }

  // ==========================================================================
  // NAVEGACIÓN PRINCIPAL (4 PESTAÑAS EXCLUSIVAS)
  // ==========================================================================
  function navigate(tabId) {
    playTone('click');
    stopWebcamStream();
    state.currentTab = tabId;

    document.querySelectorAll('.app-screen').forEach(scr => {
      scr.classList.toggle('active', scr.id === `screen-${tabId}`);
    });

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === tabId);
    });
  }

  function openModoAventuraFromInicio() {
    navigate('modos');
    switchModosView('islands');
  }

  function openFamiliaFromInicio() {
    if (RASTI_DATA.user.ageGroup === '4-6' || !RASTI_DATA.user.parentalConsent) {
      openModoAventuraFromInicio();
      return;
    }
    navigate('modos');
    switchModosView('familia');
  }

  // ==========================================================================
  // ACTUALIZACIÓN DEL HUD SUPERIOR Y MODO POR EDAD (4-6 vs 7-10 AÑOS)
  // ==========================================================================
  function updateTopHud() {
    const u = RASTI_DATA.user;
    const profile = RASTI_DATA.profiles.find(p => p.id === u.avatarId) || RASTI_DATA.profiles[0];
    const isYoung = u.ageGroup === '4-6';
    const hideCommunity = isYoung || !u.parentalConsent;

    document.body.classList.toggle('age-mode-4-6', hideCommunity);

    if (hideCommunity && state.modosView === 'familia') {
      switchModosView('islands');
    }

    document.getElementById('hud-avatar-img').src = profile.img;
    document.getElementById('hud-username').textContent = u.username;
    const exactAge = u.age || (isYoung ? 5 : 8);
    document.getElementById('hud-user-sub').textContent =
      `⭐ Nivel ${u.level} • ${exactAge} años${isYoung ? ' 🔊' : ''}`;
    document.getElementById('hud-stars-count').textContent = u.stars;

    const welcomeName = document.getElementById('inicio-welcome-name');
    if (welcomeName) welcomeName.textContent = u.displayName || profile.name;

    const welcomeMsg = document.getElementById('inicio-welcome-msg');
    if (welcomeMsg) {
      welcomeMsg.textContent = isYoung
        ? '¡Tocá 🔊 para escuchar y elegí tu aventura!'
        : '¡Elegí tu aventura para empezar a construir!';
    }
  }

  function setAgeGroup(ageGroup) {
    playTone('pop');
    RASTI_DATA.user.ageGroup = ageGroup;
    if (ageGroup === '4-6' && (!RASTI_DATA.user.age || RASTI_DATA.user.age > 6)) {
      RASTI_DATA.user.age = 5;
    } else if (ageGroup === '7-10' && (!RASTI_DATA.user.age || RASTI_DATA.user.age <= 6)) {
      RASTI_DATA.user.age = 8;
    }
    document.getElementById('btn-age-7-10')?.classList.toggle('active', ageGroup === '7-10');
    document.getElementById('btn-age-4-6')?.classList.toggle('active', ageGroup === '4-6');
    updateTopHud();
    if (ageGroup === '4-6') {
      showToast('Modo 4 a 6 años: Voz argentina activada y comunidad oculta 🔒', '👶');
    } else {
      showToast('Modo 7 a 10 años: Desafíos + Familia Rasti habilitada 🚀', '🧒');
    }
  }

  function speakWelcome() {
    const u = RASTI_DATA.user;
    const btn = document.getElementById('btn-voice-welcome');
    btn?.classList.add('speaking');

    const mp3 = u.ageGroup === '4-6' ? 'welcome_4_6.mp3' : 'welcome_7_10.mp3';
    const text = u.ageGroup === '4-6'
      ? '¡Hola! Qué lindo verte en Universo Rasti. Prepará tus bloques de colores, ¡elegí una aventura y vamos a construir juntos!'
      : '¡Hola constructor! Tus 400 bloques Rasti están listos. Elegí un mundo en Modo Aventura para armar tu creación y escanearla con la cámara.';

    showToast(`🔊 "${text}"`, '🇦🇷');
    playArgentineVoice(mp3, text, () => {
      btn?.classList.remove('speaking');
    });
  }

  function toggleFullscreen() {
    playTone('click');
    document.body.classList.toggle('fullscreen-mode');
    const isFull = document.body.classList.contains('fullscreen-mode');
    const btn = document.getElementById('btn-toggle-fullscreen');
    if (btn) {
      btn.innerHTML = isFull ? '📱 Vista Tablet Demo' : '🖥️ Pantalla Completa';
      btn.classList.toggle('active', isFull);
    }
  }

  // ==========================================================================
  // SECCIÓN 2: PERSONALIZACIÓN DEL AVATAR (PÁGINA 3 DEL PDF)
  // ==========================================================================
  function renderPersonalizacion() {
    const u = RASTI_DATA.user;
    const c = RASTI_DATA.customization;
    const gender = u.gender;

    const profilesRow = document.getElementById('custom-profiles-row');
    if (profilesRow) {
      profilesRow.innerHTML = RASTI_DATA.profiles.map(p => `
        <button type="button" class="base-profile-btn ${u.avatarId === p.id ? 'selected' : ''}"
                onclick="RastiApp.selectBaseProfile(${p.id})">
          <img src="${p.img}" alt="${p.name}" />
          <span>${p.name}</span>
        </button>
      `).join('');
    }

    const skinRow = document.getElementById('custom-skin-row');
    if (skinRow) {
      skinRow.innerHTML = c.skinTones.map(s => `
        <button type="button" class="color-swatch-btn ${u.skinTone === s.id ? 'selected' : ''}"
                style="background:${s.hex};"
                title="${s.name}"
                onclick="RastiApp.selectCustomOption('skinTone', ${s.id})"></button>
      `).join('');
    }

    const eyesRow = document.getElementById('custom-eyes-row');
    if (eyesRow) {
      eyesRow.innerHTML = c.eyeColors.map(e => `
        <button type="button" class="eye-swatch-btn ${u.eyeColor === e.id ? 'selected' : ''}"
                style="background:radial-gradient(circle, ${e.ring} 35%, ${e.hex} 100%);"
                title="${e.name}"
                onclick="RastiApp.selectCustomOption('eyeColor', ${e.id})"></button>
      `).join('');
    }

    const hairGrid = document.getElementById('custom-hairstyles-grid');
    if (hairGrid) {
      const list = c.hairStyles[gender];
      hairGrid.innerHTML = list.map(h => `
        <button type="button" class="item-thumb-btn ${u.hairStyle === h.id ? 'selected' : ''}"
                title="${h.name}"
                onclick="RastiApp.selectCustomOption('hairStyle', ${h.id})">
          <img src="${h.img}" alt="${h.name}" />
        </button>
      `).join('');
    }

    const hairColorRow = document.getElementById('custom-haircolor-row');
    if (hairColorRow) {
      hairColorRow.innerHTML = c.hairColors.map(hc => `
        <button type="button" class="color-swatch-btn ${u.hairColor === hc.id ? 'selected' : ''}"
                style="background:${hc.hex};"
                title="${hc.name}"
                onclick="RastiApp.selectCustomOption('hairColor', ${hc.id})"></button>
      `).join('');
    }

    const topsGrid = document.getElementById('custom-tops-grid');
    if (topsGrid) {
      topsGrid.innerHTML = c.tops[gender].map(t => `
        <button type="button" class="item-thumb-btn ${u.topItem === t.id && !u.specialSuit ? 'selected' : ''}"
                title="${t.name}"
                onclick="RastiApp.selectClothingItem('topItem', ${t.id})">
          <img src="${t.img}" alt="${t.name}" />
        </button>
      `).join('');
    }

    const bottomsGrid = document.getElementById('custom-bottoms-grid');
    if (bottomsGrid) {
      bottomsGrid.innerHTML = c.bottoms[gender].map(b => `
        <button type="button" class="item-thumb-btn ${u.bottomItem === b.id && !u.specialSuit ? 'selected' : ''}"
                title="${b.name}"
                onclick="RastiApp.selectClothingItem('bottomItem', ${b.id})">
          <img src="${b.img}" alt="${b.name}" />
        </button>
      `).join('');
    }

    const suitsGrid = document.getElementById('custom-suits-grid');
    if (suitsGrid) {
      suitsGrid.innerHTML = c.specialSuits.map(s => `
        <button type="button" class="item-thumb-btn ${u.specialSuit === s.id ? 'selected' : ''}"
                title="${s.name}"
                onclick="RastiApp.selectSpecialSuit(${s.id})">
          <img src="${s.img}" alt="${s.name}" />
        </button>
      `).join('');
    }

    const accGrid = document.getElementById('custom-accessories-grid');
    if (accGrid) {
      const combined = [
        ...c.accessories.slice(0, 4),
        c.backpacks[0],
        c.accessories[4]
      ];
      accGrid.innerHTML = combined.map(a => {
        const isSel = (a.id === 5 && u.backpack === 5) || (a.id !== 5 && u.accessory === a.id);
        return `
          <button type="button" class="item-thumb-btn ${isSel ? 'selected' : ''}"
                  title="${a.name}"
                  onclick="RastiApp.selectAccessoryItem(${a.id})">
            <img src="${a.img}" alt="${a.name}" />
          </button>
        `;
      }).join('');
    }

    updateCharacterStagePreview();
  }

  function updateCharacterStagePreview() {
    const u = RASTI_DATA.user;
    const c = RASTI_DATA.customization;
    const gender = u.gender;

    const stageImg = document.getElementById('stage-character-img');
    if (stageImg) {
      stageImg.src = gender === 'girl' ? 'assets/custom/girl-full.png' : 'assets/custom/boy-full.png';
      const skinObj = c.skinTones.find(s => s.id === u.skinTone) || c.skinTones[1];
      stageImg.style.filter = skinObj.filter;
    }

    const skinObj = c.skinTones.find(s => s.id === u.skinTone) || c.skinTones[1];
    const eyeObj = c.eyeColors.find(e => e.id === u.eyeColor) || c.eyeColors[0];
    const hairObj = c.hairStyles[gender].find(h => h.id === u.hairStyle) || c.hairStyles[gender][0];
    const hairColObj = c.hairColors.find(hc => hc.id === u.hairColor) || c.hairColors[0];
    const topObj = c.tops[gender].find(t => t.id === u.topItem) || c.tops[gender][0];
    const botObj = c.bottoms[gender].find(b => b.id === u.bottomItem) || c.bottoms[gender][0];
    const suitObj = u.specialSuit ? c.specialSuits.find(s => s.id === u.specialSuit) : null;
    const accObj = c.accessories.find(a => a.id === u.accessory) || c.accessories[0];
    const profileObj = RASTI_DATA.profiles.find(p => p.id === u.avatarId) || RASTI_DATA.profiles[0];

    const lblSkin = document.getElementById('label-skin-name');
    const lblEye = document.getElementById('label-eye-name');
    const lblHair = document.getElementById('label-hair-name');
    const lblClothes = document.getElementById('label-clothes-name');
    if (lblSkin) lblSkin.textContent = skinObj.name;
    if (lblEye) lblEye.textContent = eyeObj.name;
    if (lblHair) lblHair.textContent = `${hairObj.name}`;
    if (lblClothes) lblClothes.textContent = suitObj ? suitObj.name : `${topObj.name}`;

    const pillsEl = document.getElementById('stage-equipped-pills');
    if (pillsEl) {
      pillsEl.innerHTML = `
        <span class="equipped-badge">
          <img src="${profileObj.img}" alt="" style="width:16px;height:16px;border-radius:50%;" />
          ${u.displayName || profileObj.name}
        </span>
        <span class="equipped-badge">
          <span class="color-dot" style="background:${skinObj.hex};"></span>
          Piel
        </span>
        <span class="equipped-badge">
          <span class="color-dot" style="background:${hairColObj.hex};"></span>
          ${hairObj.name}
        </span>
      `;
    }

    const liveBox = document.getElementById('stage-live-preview-box');
    if (liveBox) {
      liveBox.innerHTML = `
        <img class="stage-live-thumb" src="${hairObj.img}" alt="Peinado" />
        <img class="stage-live-thumb" src="${suitObj ? suitObj.img : topObj.img}" alt="Prenda" />
        ${!suitObj ? `<img class="stage-live-thumb" src="${botObj.img}" alt="Pantalón" />` : ''}
        <img class="stage-live-thumb" src="${accObj.img}" alt="Accesorio" />
      `;
    }
  }

  function setCharacterGender(gender) {
    playTone('pop');
    RASTI_DATA.user.gender = gender;
    RASTI_DATA.user.avatarId = gender === 'girl' ? 2 : 1;
    document.getElementById('btn-gender-boy')?.classList.toggle('active', gender === 'boy');
    document.getElementById('btn-gender-girl')?.classList.toggle('active', gender === 'girl');
    renderPersonalizacion();
    updateTopHud();
  }

  function selectBaseProfile(profileId) {
    playTone('pop');
    const p = RASTI_DATA.profiles.find(item => item.id === profileId);
    if (!p) return;
    RASTI_DATA.user.avatarId = p.id;
    RASTI_DATA.user.displayName = p.name;
    RASTI_DATA.user.gender = p.gender;
    const hairMap = { 1: 1, 2: 1, 3: 8, 4: 4, 5: 2, 6: 7, 7: 6, 8: 6, 9: 4, 10: 3 };
    if (hairMap[p.id]) RASTI_DATA.user.hairStyle = hairMap[p.id];
    document.getElementById('btn-gender-boy')?.classList.toggle('active', p.gender === 'boy');
    document.getElementById('btn-gender-girl')?.classList.toggle('active', p.gender === 'girl');
    renderPersonalizacion();
    updateTopHud();
  }

  function selectCustomOption(key, value) {
    playTone('pop');
    RASTI_DATA.user[key] = value;
    renderPersonalizacion();
  }

  function selectClothingItem(type, id) {
    const u = RASTI_DATA.user;
    const list = type === 'topItem' ? RASTI_DATA.customization.tops[u.gender] : RASTI_DATA.customization.bottoms[u.gender];
    const item = list.find(i => i.id === id);
    if (!item) return;

    if (item.locked) {
      if (u.stars >= (item.cost || 10)) {
        u.stars -= (item.cost || 10);
        item.locked = false;
        u[type] = id;
        u.specialSuit = null;
        playTone('success');
        updateTopHud();
        renderPersonalizacion();
        showToast(`¡Desbloqueaste "${item.name}"!`, '🔓');
      } else {
        showToast(`Necesitás ${item.cost} ⭐`, '🔒');
      }
      return;
    }

    playTone('pop');
    u[type] = id;
    u.specialSuit = null;
    renderPersonalizacion();
  }

  function selectSpecialSuit(id) {
    const u = RASTI_DATA.user;
    const suit = RASTI_DATA.customization.specialSuits.find(s => s.id === id);
    if (!suit) return;

    if (suit.locked) {
      if (u.stars >= (suit.cost || 25)) {
        u.stars -= (suit.cost || 25);
        suit.locked = false;
        u.specialSuit = id;
        playTone('success');
        updateTopHud();
        renderPersonalizacion();
        showToast(`¡Desbloqueaste ${suit.name}!`, '🧑‍🚀');
      } else {
        showToast(`Necesitás ${suit.cost} ⭐`, '🔒');
      }
      return;
    }

    playTone('pop');
    u.specialSuit = u.specialSuit === id ? null : id;
    renderPersonalizacion();
  }

  function selectAccessoryItem(id) {
    playTone('pop');
    if (id === 5) {
      RASTI_DATA.user.backpack = 5;
    } else {
      const acc = RASTI_DATA.customization.accessories.find(a => a.id === id);
      if (acc && acc.locked && RASTI_DATA.user.stars >= (acc.cost || 10)) {
        RASTI_DATA.user.stars -= (acc.cost || 10);
        acc.locked = false;
        RASTI_DATA.user.accessory = id;
        playTone('success');
        updateTopHud();
      } else if (acc && !acc.locked) {
        RASTI_DATA.user.accessory = id;
      }
    }
    renderPersonalizacion();
  }

  function filterCustomCategory(cat) {
    playTone('click');
    state.customFilter = cat;
    document.querySelectorAll('.cat-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    document.querySelectorAll('#screen-personalizacion [data-section]').forEach(sec => {
      if (cat === 'all') {
        sec.style.display = '';
      } else {
        sec.style.display = sec.dataset.section === cat ? '' : 'none';
      }
    });
  }

  function toggleCharacterZoom() {
    playTone('pop');
    state.charZoomed = !state.charZoomed;
    document.getElementById('character-stage-card')?.classList.toggle('zoomed', state.charZoomed);
  }

  function toggleCharacterFlip() {
    playTone('pop');
    state.charFlipped = !state.charFlipped;
    document.getElementById('character-stage-card')?.classList.toggle('flipped', state.charFlipped);
  }

  function randomizeAvatar() {
    playTone('success');
    const u = RASTI_DATA.user;
    const rand = (max) => Math.floor(Math.random() * max) + 1;
    const randomProfile = RASTI_DATA.profiles[Math.floor(Math.random() * RASTI_DATA.profiles.length)];
    u.avatarId = randomProfile.id;
    u.displayName = randomProfile.name;
    u.gender = randomProfile.gender;
    u.skinTone = rand(5);
    u.eyeColor = rand(5);
    u.hairStyle = rand(8);
    u.hairColor = rand(7);
    u.topItem = rand(5);
    u.bottomItem = rand(5);
    u.specialSuit = null;
    u.accessory = [1, 4][Math.floor(Math.random() * 2)];

    document.getElementById('btn-gender-boy')?.classList.toggle('active', u.gender === 'boy');
    document.getElementById('btn-gender-girl')?.classList.toggle('active', u.gender === 'girl');

    renderPersonalizacion();
    updateTopHud();
    showToast('🎲 ¡Look Sorpresa listo!', '✨');
  }

  function saveAvatarCustomization() {
    playTone('success');
    updateTopHud();
    showToast('¡Avatar guardado!', '✅');
  }

  // ==========================================================================
  // SECCIÓN 3: MODOS (SOLO MODO AVENTURA Y FAMILIA RASTI)
  // ==========================================================================
  function isReinoLevel1Completed() {
    const reino = RASTI_DATA.worlds.find(w => w.id === 'reino');
    const m1 = reino && reino.missions.find(m => m.num === 1);
    return Boolean(m1 && m1.status === 'completed');
  }

  function renderModos() {
    // 1. Renderizar las 4 Islas Flotantes de Modo Aventura (Reino Perdido 1°)
    const islandsContainer = document.getElementById('modos-view-islands');
    if (islandsContainer) {
      const reinoDone = isReinoLevel1Completed();
      islandsContainer.innerHTML = RASTI_DATA.worlds.map(w => {
        const isWorldLocked = w.id !== 'reino' && !reinoDone;
        return `
          <div class="floating-island-node ${isWorldLocked ? 'island-locked' : ''}" onclick="RastiApp.openWorldModal('${w.id}')">
            <img class="island-art-img" src="${w.badgeImg}" alt="${w.name}" style="${isWorldLocked ? 'filter:grayscale(0.35) brightness(0.88);' : ''}" />
            <div class="island-info-pill">
              ${isWorldLocked ? `
                <span class="stars-tag">🔒 Bloqueado</span>
                <span class="missions-tag">Nivel 0/${w.totalMissions}</span>
                <span style="font-family:var(--font-btn);font-weight:700;font-size:0.78rem;color:#fca5a5;">VER →</span>
              ` : `
                <span class="stars-tag">⭐ ${w.starsEarned}/${w.totalStars}</span>
                <span class="missions-tag">Nivel ${w.completedMissions}/${w.totalMissions}</span>
                <span style="font-family:var(--font-btn);font-weight:700;font-size:0.78rem;color:var(--rasti-yellow);">JUGAR →</span>
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    // 2. Renderizar Galería Familia Rasti
    renderFamiliaGallery();
  }

  function switchModosView(viewName) {
    playTone('click');
    const isYoung = RASTI_DATA.user.ageGroup === '4-6';
    const validView = (!isYoung && viewName === 'familia') ? 'familia' : 'islands';
    state.modosView = validView;

    document.getElementById('tab-modos-islands')?.classList.toggle('active', validView === 'islands');
    document.getElementById('tab-modos-familia')?.classList.toggle('active', validView === 'familia');

    const islandsEl = document.getElementById('modos-view-islands');
    const familiaEl = document.getElementById('modos-view-familia');
    if (islandsEl) islandsEl.style.display = validView === 'islands' ? 'grid' : 'none';
    if (familiaEl) familiaEl.style.display = validView === 'familia' ? 'flex' : 'none';
  }

  function renderFamiliaGallery() {
    const grid = document.getElementById('familia-gallery-grid');
    if (!grid) return;

    const list = state.familiaTab === 'todos'
      ? RASTI_DATA.familiaGallery
      : RASTI_DATA.familiaGallery.filter(item => item.category === state.familiaTab);

    grid.innerHTML = list.map(post => `
      <div class="familia-post-card">
        <div class="post-card-header">
          <div class="post-author-info">
            <img src="${post.avatar}" alt="${post.author}" />
            <span class="post-author-name">${post.author}</span>
          </div>
          <button type="button" class="post-report-btn" onclick="RastiApp.reportPost(${post.id})" title="Reportar publicación">
            •••
          </button>
        </div>

        <div class="post-photo-wrap" onclick="RastiApp.openPostDetailModal(${post.id})">
          <img src="${post.img}" alt="${post.title}" />
          <span class="post-world-tag">🧱 ${post.blocksUsed}</span>
        </div>

        <div class="post-card-actions">
          <button type="button" class="btn-like-pill ${post.liked ? 'liked' : ''}" onclick="RastiApp.toggleLikePost(${post.id})">
            <span>${post.liked ? '❤️' : '🤍'}</span>
            <span>${post.likesDisplay}</span>
          </button>
          <button type="button" class="btn-save-pill ${post.saved ? 'saved' : ''}" onclick="RastiApp.toggleSavePost(${post.id})" title="Guardar">
            🔖
          </button>
        </div>
      </div>
    `).join('');
  }

  function filterFamiliaTab(tabName) {
    playTone('click');
    state.familiaTab = tabName;
    document.querySelectorAll('#familia-subtabs .familia-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.ftab === tabName);
    });
    renderFamiliaGallery();
  }

  function toggleLikePost(postId) {
    playTone('pop');
    const post = RASTI_DATA.familiaGallery.find(p => p.id === postId);
    if (!post) return;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    post.likesDisplay = post.likes >= 1000 ? (post.likes / 1000).toFixed(1) + 'K' : String(post.likes);
    renderFamiliaGallery();
  }

  function toggleSavePost(postId) {
    playTone('pop');
    const post = RASTI_DATA.familiaGallery.find(p => p.id === postId);
    if (!post) return;
    post.saved = !post.saved;
    renderFamiliaGallery();
    showToast(post.saved ? '¡Guardado en favoritos! 🔖' : 'Quitado de favoritos', '🔖');
  }

  function reportPost(postId) {
    playTone('click');
    showToast('🛡️ Enviado a revisión del moderador.', '🛡️');
  }

  // ==========================================================================
  // SECCIÓN 4: LOGROS (SÚPER VISUAL, REDUCIDO E INTUITIVO PARA NIÑOS)
  // ==========================================================================
  function renderLogros() {
    const ach = RASTI_DATA.achievements;
    const u = RASTI_DATA.user;

    document.getElementById('kpi-stars').textContent = u.stars;
    document.getElementById('kpi-medals').textContent = `${ach.summary.medalsUnlocked}/${ach.summary.medalsTotal}`;
    document.getElementById('kpi-builds').textContent = ach.completedBuilds.length;

    // 1. Medallas grandes y visuales (sin texto largo)
    const medalsGrid = document.getElementById('logros-medals-grid');
    if (medalsGrid) {
      medalsGrid.innerHTML = ach.medals.map(m => `
        <div class="kid-medal-item ${m.unlocked ? '' : 'locked'}" onclick="RastiApp.openMedalModal(${m.id})">
          <div class="kid-medal-circle" style="background:${m.color};">
            <span>${m.icon}</span>
          </div>
          <span class="kid-medal-name">${m.title}</span>
        </div>
      `).join('');
    }

    // 2. Construcciones completadas (Fotos limpias)
    const buildsStrip = document.getElementById('logros-builds-strip');
    if (buildsStrip) {
      buildsStrip.innerHTML = ach.completedBuilds.map(b => `
        <div class="completed-build-card" onclick="RastiApp.openScannerModal('${b.name}', '${b.world}', '${b.img}', ${b.stars})">
          <img src="${b.img}" alt="${b.name}" />
          <div class="completed-build-name">${b.name}</div>
          <div class="completed-build-tags">
            <span>🧱 ${b.blocks}</span>
            <span>⭐ +${b.stars}</span>
          </div>
        </div>
      `).join('');
    }

    const hasClaimable = ach.challenges.some(c => c.status === 'claimable');
    const badge = document.getElementById('nav-logros-badge');
    if (badge) badge.style.display = hasClaimable ? 'inline-block' : 'none';
    const claimBtn = document.getElementById('btn-claim-daily');
    if (claimBtn) {
      if (hasClaimable) {
        claimBtn.className = 'btn-rasti btn-rasti-yellow kid-reward-chest-btn';
        claimBtn.innerHTML = '<span style="font-size:1.5rem;">🎁</span><span>¡PREMIO +15 ⭐!</span>';
      } else {
        claimBtn.className = 'btn-rasti btn-rasti-completed kid-reward-chest-btn';
        claimBtn.innerHTML = '<span>✓ PREMIO RECIBIDO</span>';
      }
    }
  }

  function claimChallengeReward(challengeId) {
    const ch = RASTI_DATA.achievements.challenges.find(c => c.id === challengeId);
    if (!ch || ch.status !== 'claimable') {
      showToast('¡Ya abriste tu cofre de premio de hoy! ⭐', '🎁');
      return;
    }

    playTone('success');
    ch.status = 'completed';
    RASTI_DATA.user.stars += ch.reward;
    document.getElementById('logros-overall-bar').style.width = '90%';

    updateTopHud();
    renderLogros();
    showToast(`🎉 ¡Ganaste +${ch.reward} estrellas Rasti! ⭐`, '🏆');
  }

  // ==========================================================================
  // MODALES INTERACTIVOS: MAPA VISUAL DE NIVELES + WEBCAM EN VIVO
  // ==========================================================================
  function stopWebcamStream() {
    if (state.webcamStream) {
      state.webcamStream.getTracks().forEach(track => track.stop());
      state.webcamStream = null;
    }
  }

  function openModal(htmlContent) {
    const backdrop = document.getElementById('rasti-modal-backdrop');
    const content = document.getElementById('rasti-modal-content');
    if (!backdrop || !content) return;
    content.innerHTML = htmlContent;
    backdrop.classList.add('open');
  }

  function closeModal() {
    playTone('click');
    stopWebcamStream();
    document.getElementById('rasti-modal-backdrop')?.classList.remove('open');
  }

  function closeModalOnBackdrop(e) {
    if (e.target.id === 'rasti-modal-backdrop') {
      closeModal();
    }
  }

  // Mapa Visual de Niveles para cada Aventura (Sin exceso de texto)
  function openWorldModal(worldId, selectedNum = null) {
    playTone('pop');
    const w = RASTI_DATA.worlds.find(item => item.id === worldId);
    if (!w) return;

    state.selectedWorldId = w.id;
    const currentMission = w.missions.find(m => m.status === 'current') || w.missions[0];
    const activeNum = selectedNum || currentMission.num;
    state.selectedMissionNum = activeNum;

    const chosenMission = w.missions.find(m => m.num === activeNum) || currentMission;
    const profile = RASTI_DATA.profiles.find(p => p.id === RASTI_DATA.user.avatarId) || RASTI_DATA.profiles[0];

    if (chosenMission.status === 'locked') {
      showToast('🔒 Debes completar el nivel 1 de Reino Perdido para avanzar', '🏰');
    }

    const html = `
      <!-- Encabezado Visual de la Aventura (Sin botón de Película) -->
      <div class="visual-world-header" style="background:${w.bgGradient};">
        <div class="visual-world-title-group">
          <img src="${w.badgeImg}" alt="${w.name}" />
          <div>
            <h2 style="font-family:var(--font-title);font-size:1.65rem;color:var(--rasti-yellow);line-height:1.05;">
              ${w.name.toUpperCase()}
            </h2>
            <div style="font-family:var(--font-btn);font-weight:700;font-size:0.86rem;margin-top:3px;">
              ⭐ ${w.starsEarned}/${w.totalStars} Estrellas • Nivel ${w.completedMissions}/${w.totalMissions}
            </div>
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-right:42px;">
          <button type="button" class="btn-rasti btn-rasti-yellow" style="padding:8px 14px;font-size:0.82rem;" onclick="RastiApp.speakWorldStory('${w.id}')">
            🔊 ESCUCHAR
          </button>
        </div>
      </div>

      <!-- MAPA VISUAL DE CAMINO DE NIVELES (1 -> 2 -> 3 -> 4 -> 5 -> 6) -->
      <div class="visual-level-map">
        <div class="level-nodes-path">
          ${w.missions.map(m => {
            const isSelected = m.num === chosenMission.num;
            const iconInside = m.status === 'completed' ? '✓' : (m.status === 'locked' ? '🔒' : m.num);
            const starsRow = m.status === 'completed' ? '⭐⭐⭐' : (m.status === 'current' ? '⭐' : '☆☆☆');
            return `
              <button type="button"
                      class="level-node-btn ${m.status}"
                      onclick="RastiApp.openWorldModal('${w.id}', ${m.num})"
                      style="${isSelected ? 'filter:drop-shadow(0 0 10px rgba(0,81,186,0.55));' : ''}">
                ${m.status === 'current' ? `<img class="level-node-avatar-pin" src="${profile.img}" alt="${profile.name}" />` : ''}
                <div class="level-node-circle">
                  <span>${iconInside}</span>
                </div>
                <span class="level-node-stars">${starsRow}</span>
                <span class="level-node-label">Nivel ${m.num}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- TARJETA VISUAL DEL NIVEL SELECCIONADO -->
      <div class="level-visual-action-card">
        <div class="level-build-preview-box">
          <img src="${w.buildPreview}" alt="${chosenMission.title}" />
          <div>
            <span style="background:var(--rasti-light);color:var(--rasti-blue);font-family:var(--font-btn);font-weight:700;font-size:0.75rem;padding:3px 10px;border-radius:999px;">
              NIVEL ${chosenMission.num}
            </span>
            <h3 style="font-family:var(--font-title);font-size:1.35rem;color:var(--rasti-navy);margin-top:4px;">
              ${chosenMission.title}
            </h3>
            ${chosenMission.status === 'locked' ? `
              <div style="margin-top:4px;font-family:var(--font-btn);font-weight:700;font-size:0.86rem;color:var(--rasti-red);">
                🔒 Debes completar el nivel 1 de Reino Perdido para avanzar
              </div>
            ` : `
              <div style="display:flex;gap:10px;margin-top:4px;font-family:var(--font-btn);font-weight:700;font-size:0.84rem;color:var(--rasti-forest);">
                <span>🧱 ${chosenMission.blocks} bloques</span>
                <span>⭐ +${chosenMission.stars} estrellas</span>
              </div>
            `}
          </div>
        </div>

        <div>
          ${chosenMission.status === 'locked' ? `
            <button type="button" class="btn-rasti btn-rasti-primary" style="padding:11px 18px;font-size:0.88rem;"
                    onclick="RastiApp.openWorldModal('reino', 1)">
              🏰 IR A NIVEL 1 DE REINO PERDIDO →
            </button>
          ` : `
            <button type="button" class="btn-rasti btn-rasti-build" style="padding:12px 24px;font-size:1rem;"
                    onclick="RastiApp.openScannerModal('${chosenMission.title}', '${w.name}', '${w.buildPreview}', ${chosenMission.stars})">
              📷 ESCANEAR CON CÁMARA
            </button>
          `}
        </div>
      </div>
    `;

    openModal(html);
  }

  function speakWorldStory(worldId) {
    const w = RASTI_DATA.worlds.find(item => item.id === worldId);
    if (!w) return;
    const mp3Map = {
      espacial: 'world_espacial.mp3',
      isla: 'world_isla.mp3',
      reino: 'world_reino.mp3',
      submarina: 'world_submarina.mp3'
    };
    const text = RASTI_DATA.user.ageGroup === '4-6' ? w.storyAudio4to6 : w.storyText7to10;
    showToast(`🔊 "${w.name}"`, '🇦🇷');
    playArgentineVoice(mp3Map[w.id], text);
  }

  // ==========================================================================
  // ESCÁNER CON WEBCAM REAL EN VIVO (getUserMedia)
  // ==========================================================================
  function openScannerModal(buildTitle, worldName, imgPath, starsReward = 15) {
    playTone('pop');
    stopWebcamStream();

    const html = `
      <div style="text-align:center;">
        <span style="background:var(--rasti-navy);color:var(--rasti-yellow);padding:4px 14px;border-radius:999px;font-family:var(--font-btn);font-size:0.78rem;font-weight:700;">
          📷 CÁMARA EN VIVO • ESCÁNER DE BLOQUES RASTI
        </span>
        <h2 style="font-family:var(--font-title);font-size:1.5rem;color:var(--rasti-navy);margin-top:6px;">
          MOSTRÁ TU CONSTRUCCIÓN: ${buildTitle.toUpperCase()}
        </h2>
      </div>

      <div class="scanner-viewfinder" style="height:290px;">
        <!-- Video en vivo de la Webcam -->
        <video id="scanner-webcam-video" autoplay playsinline muted></video>

        <!-- Línea láser y marco visual OpenCV -->
        <div class="scanner-laser-line"></div>
        <div class="scanner-hud-overlay">
          <div style="display:flex;justify-content:space-between;">
            <span id="scanner-cam-status">● ACTIVANDO CÁMARA WEB...</span>
            <span>${worldName.toUpperCase()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>✓ BUSCANDO BLOQUES RASTI</span>
            <span>OPENCV EN VIVO</span>
          </div>
        </div>

        <!-- Miniatura de referencia en la esquina -->
        <div class="scanner-ref-corner">
          <img src="${imgPath}" alt="${buildTitle}" />
          <div style="font-family:var(--font-btn);font-size:0.72rem;line-height:1.15;padding-right:4px;">
            <div style="color:var(--rasti-yellow);font-weight:700;">MODELO</div>
            <div>${buildTitle}</div>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-top:10px;">
        <button type="button" class="btn-rasti btn-rasti-build" style="padding:12px 28px;font-size:1.05rem;"
                onclick="RastiApp.confirmScannedBuild('${buildTitle}', '${worldName}', '${imgPath}', ${starsReward})">
          📸 ¡CAPTURAR Y GANAR +${starsReward} ⭐!
        </button>
      </div>
    `;

    openModal(html);
    playArgentineVoice('scan_ready.mp3', '¡Mostrá tu construcción Rasti frente a la cámara para escanearla!');

    // Iniciar la Webcam real del usuario
    const videoEl = document.getElementById('scanner-webcam-video');
    const statusEl = document.getElementById('scanner-cam-status');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .catch(() => navigator.mediaDevices.getUserMedia({ video: true, audio: false }))
        .then(stream => {
          state.webcamStream = stream;
          if (videoEl) {
            videoEl.srcObject = stream;
          }
          if (statusEl) {
            statusEl.textContent = '● CÁMARA WEB ACTIVA • ENCUADRÁ TUS BLOQUES';
          }
        })
        .catch(() => {
          if (statusEl) {
            statusEl.textContent = '● MODO SIMULACIÓN (CÁMARA NO DETECTADA)';
          }
          if (videoEl) {
            videoEl.poster = imgPath;
          }
        });
    } else if (videoEl) {
      videoEl.poster = imgPath;
    }
  }

  function confirmScannedBuild(buildTitle, worldName, imgPath, starsReward) {
    playTone('success');
    stopWebcamStream();
    RASTI_DATA.user.stars += starsReward;

    // Si completó el Nivel 1 de Reino Perdido (o la misión actual del mundo activo), avanzar progreso
    const targetWorld = RASTI_DATA.worlds.find(w => w.name === worldName || w.id === state.selectedWorldId);
    if (targetWorld) {
      const mission = targetWorld.missions.find(m => m.title === buildTitle) ||
                      targetWorld.missions.find(m => m.status === 'current');
      if (mission && mission.status !== 'completed') {
        mission.status = 'completed';
        targetWorld.completedMissions = targetWorld.missions.filter(m => m.status === 'completed').length;
        targetWorld.starsEarned = Math.min(targetWorld.totalStars, targetWorld.starsEarned + starsReward);
        const nextMission = targetWorld.missions.find(m => m.num === mission.num + 1);
        if (nextMission && nextMission.status === 'locked') {
          nextMission.status = 'current';
        }
      }
      // Si se acaba de completar el Nivel 1 de Reino Perdido, habilitar el Nivel 1 de los demás mundos
      if (targetWorld.id === 'reino' && isReinoLevel1Completed()) {
        RASTI_DATA.worlds.forEach(w => {
          if (w.id !== 'reino') {
            const firstM = w.missions.find(m => m.num === 1);
            if (firstM && firstM.status === 'locked') {
              firstM.status = 'current';
            }
          }
        });
      }
    }

    const exists = RASTI_DATA.achievements.completedBuilds.some(b => b.name === buildTitle);
    if (!exists) {
      RASTI_DATA.achievements.completedBuilds.unshift({
        id: Date.now(),
        name: buildTitle,
        world: worldName,
        img: imgPath,
        blocks: 42,
        stars: starsReward,
        precision: '98%'
      });
    }

    updateTopHud();
    renderModos();
    renderLogros();
    closeModal();
    playArgentineVoice('scan_success.mp3', '¡Excelente construcción! Se sumó a tu aventura y ganaste nuevas estrellas.');
    showToast(`🎉 ¡"${buildTitle}" escaneada! Ganaste +${starsReward} ⭐`, '🚀');
  }

  function openStoryMovieModal(worldId) {
    playTone('success');
    const w = RASTI_DATA.worlds.find(item => item.id === worldId) || RASTI_DATA.worlds[0];
    const profile = RASTI_DATA.profiles.find(p => p.id === RASTI_DATA.user.avatarId) || RASTI_DATA.profiles[0];

    const html = `
      <div style="text-align:center;">
        <span style="background:var(--rasti-yellow);color:var(--rasti-navy);padding:4px 14px;border-radius:999px;font-family:var(--font-btn);font-size:0.76rem;font-weight:700;">
          🎬 TU PELÍCULA RASTI
        </span>
        <h2 style="font-family:var(--font-title);font-size:1.55rem;color:var(--rasti-navy);margin-top:6px;">
          ${(RASTI_DATA.user.displayName || profile.name).toUpperCase()} EN ${w.name.toUpperCase()}
        </h2>
      </div>

      <div style="position:relative;border-radius:22px;overflow:hidden;border:4px solid var(--rasti-navy);height:250px;margin:12px 0;background:${w.bgGradient};display:flex;align-items:center;justify-content:space-around;padding:16px;">
        <div style="text-align:center;color:#fff;">
          <img src="${profile.img}" alt="${profile.name}" style="width:110px;height:110px;border-radius:50%;border:4px solid var(--rasti-yellow);box-shadow:0 8px 20px rgba(0,0,0,0.4);" />
          <div style="font-family:var(--font-btn);font-weight:700;margin-top:6px;">${RASTI_DATA.user.displayName || profile.name}</div>
        </div>
        <div style="font-size:2.4rem;color:var(--rasti-yellow);">➕</div>
        <div style="text-align:center;color:#fff;">
          <img src="${w.buildPreview}" alt="Construcción Rasti" style="width:150px;height:110px;object-fit:cover;border-radius:16px;border:4px solid #fff;box-shadow:0 8px 20px rgba(0,0,0,0.4);" />
          <div style="font-family:var(--font-btn);font-weight:700;margin-top:6px;">Tu Construcción Rasti</div>
        </div>
      </div>

      <div style="display:flex;justify-content:center;gap:12px;">
        <button type="button" class="btn-rasti btn-rasti-primary" onclick="RastiApp.speakWorldStory('${w.id}')">
          ▶ ESCUCHAR HISTORIA
        </button>
      </div>
    `;
    openModal(html);
  }

  function openShareCreationModal() {
    if (!RASTI_DATA.user.publishingEnabled) {
      playTone('click');
      showToast('🔒 Las publicaciones están deshabilitadas por el adulto responsable en Control Parental.', '👨‍👩‍👧');
      return;
    }
    playTone('pop');
    stopWebcamStream();

    const html = `
      <div style="text-align:center;">
        <span style="background:var(--rasti-yellow);color:var(--rasti-navy);padding:4px 14px;border-radius:999px;font-family:var(--font-btn);font-size:0.76rem;font-weight:700;">
          🛡️ COMUNIDAD SEGURA • FAMILIA RASTI
        </span>
        <h2 style="font-family:var(--font-title);font-size:1.5rem;color:var(--rasti-navy);margin-top:6px;">
          📷 SACÁ UNA FOTO DE TU CREACIÓN RASTI
        </h2>
      </div>

      <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:16px;margin:12px 0;align-items:center;">
        <div class="scanner-viewfinder" style="height:240px;margin:0;">
          <!-- Video en vivo de la Webcam para Compartí tu creación -->
          <video id="share-webcam-video" autoplay playsinline muted></video>
          <div class="scanner-laser-line"></div>
          <div class="scanner-hud-overlay">
            <div style="display:flex;justify-content:space-between;">
              <span id="share-cam-status">● ACTIVANDO CÁMARA WEB...</span>
              <span>@${RASTI_DATA.user.username}</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>✓ FILTRO IA DE SEGURIDAD ACTIVO</span>
              <span>SOLO BLOQUES</span>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="background:#dcfce7;border:1.5px solid #22c55e;border-radius:14px;padding:9px 12px;font-size:0.8rem;color:#14532d;font-family:var(--font-btn);">
            ✅ <strong>Solo fotos de bloques</strong> (sin datos personales)
          </div>
          <div style="background:#dcfce7;border:1.5px solid #22c55e;border-radius:14px;padding:9px 12px;font-size:0.8rem;color:#14532d;font-family:var(--font-btn);">
            ✅ <strong>Filtro Automático IA en cámara</strong>
          </div>
          <div style="background:#fef9c3;border:1.5px solid #eab308;border-radius:14px;padding:9px 12px;font-size:0.8rem;color:#713f12;font-family:var(--font-btn);">
            ⏳ <strong>Revisión por Moderador Humano</strong>
          </div>
          <button type="button" class="btn-rasti btn-rasti-yellow" style="margin-top:4px;width:100%;padding:12px 16px;font-size:0.95rem;" onclick="RastiApp.submitCreationForModeration()">
            📸 SACAR FOTO Y PUBLICAR ✓
          </button>
        </div>
      </div>
    `;
    openModal(html);
    playArgentineVoice('scan_ready.mp3', '¡Mostrá tu construcción Rasti frente a la cámara!');

    // Iniciar la Webcam real del usuario en Compartí tu creación
    const videoEl = document.getElementById('share-webcam-video');
    const statusEl = document.getElementById('share-cam-status');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .catch(() => navigator.mediaDevices.getUserMedia({ video: true, audio: false }))
        .then(stream => {
          state.webcamStream = stream;
          if (videoEl) {
            videoEl.srcObject = stream;
          }
          if (statusEl) {
            statusEl.textContent = '● CÁMARA ACTIVA • ENCUADRÁ TU CREACIÓN';
          }
        })
        .catch(() => {
          if (statusEl) {
            statusEl.textContent = '● MODO SIMULACIÓN (CÁMARA NO DETECTADA)';
          }
          if (videoEl) {
            videoEl.poster = 'assets/builds/build-supercar.jpg';
          }
        });
    } else if (videoEl) {
      videoEl.poster = 'assets/builds/build-supercar.jpg';
    }
  }

  function submitCreationForModeration() {
    playTone('success');
    stopWebcamStream();
    if (RASTI_DATA.user.sharedHistory) {
      RASTI_DATA.user.sharedHistory.unshift({
        id: Date.now(),
        title: 'Mi Creación con Bloques Rasti',
        world: 'Familia Rasti',
        date: 'Hoy • Recién',
        blocks: 40,
        img: 'assets/builds/build-supercar.jpg',
        status: 'En revisión de Moderador'
      });
    }
    closeModal();
    showToast('⏳ ¡Foto capturada y enviada! Un moderador la revisará antes de publicarla.', '🛡️');
  }

  function openPostDetailModal(postId) {
    playTone('pop');
    const post = RASTI_DATA.familiaGallery.find(p => p.id === postId);
    if (!post) return;
    const html = `
      <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:18px;align-items:center;">
        <img src="${post.img}" alt="${post.title}" style="width:100%;height:240px;object-fit:cover;border-radius:20px;border:3px solid #fff;box-shadow:0 8px 20px rgba(0,0,0,0.2);" />
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <img src="${post.avatar}" alt="${post.author}" style="width:38px;height:38px;border-radius:50%;border:2px solid var(--rasti-yellow);" />
            <div style="font-family:var(--font-btn);font-weight:700;color:var(--rasti-navy);">${post.author}</div>
          </div>
          <h2 style="font-family:var(--font-title);font-size:1.45rem;color:var(--rasti-navy);">${post.title}</h2>
          <div style="display:flex;gap:8px;">
            <span class="portal-pill-tag">🧱 ${post.blocksUsed} bloques</span>
          </div>
          <div style="margin-top:6px;">
            <button type="button" class="btn-rasti btn-rasti-build" style="padding:10px 18px;font-size:0.88rem;" onclick="RastiApp.toggleLikePost(${post.id});RastiApp.closeModal();">
              ❤️ ME GUSTA (${post.likesDisplay})
            </button>
          </div>
        </div>
      </div>
    `;
    openModal(html);
  }

  function openMedalModal(medalId) {
    playTone('pop');
    const m = RASTI_DATA.achievements.medals.find(item => item.id === medalId);
    if (!m) return;
    const html = `
      <div style="text-align:center;padding:10px;">
        <div class="kid-medal-circle" style="width:92px;height:92px;font-size:2.8rem;margin:0 auto 10px;background:${m.color};">
          ${m.icon}
        </div>
        <h2 style="font-family:var(--font-title);font-size:1.6rem;color:var(--rasti-navy);">${m.title.toUpperCase()}</h2>
        <p style="font-family:var(--font-btn);font-size:0.95rem;color:#334155;max-width:380px;margin:6px auto 14px;">${m.desc}</p>
        <button type="button" class="btn-rasti btn-rasti-primary" onclick="RastiApp.closeModal()">¡GENIAL!</button>
      </div>
    `;
    openModal(html);
  }

  function openNotificationsModal() {
    playTone('pop');
    document.getElementById('hud-notif-dot').style.display = 'none';
    const isYoung = RASTI_DATA.user.ageGroup === '4-6';
    const html = `
      <h2 style="font-family:var(--font-title);font-size:1.45rem;color:var(--rasti-navy);margin-bottom:10px;">
        🔔 NOVEDADES
      </h2>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${!isYoung ? `
        <div style="background:#fff;border:2px solid #86efac;border-radius:16px;padding:10px 14px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.6rem;">🛡️</span>
          <div style="font-family:var(--font-btn);font-weight:700;font-size:0.9rem;color:var(--rasti-navy);">
            ¡Tu Castillo Real fue aprobado en Familia Rasti!
          </div>
        </div>` : ''}
        <div style="background:#fff;border:2px solid #fde047;border-radius:16px;padding:10px 14px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.6rem;">🎁</span>
          <div style="font-family:var(--font-btn);font-weight:700;font-size:0.9rem;color:var(--rasti-navy);">
            ¡Tenés un cofre de +15 ⭐ listo en Logros!
          </div>
        </div>
      </div>
    `;
    openModal(html);
  }

  function openSettingsModal(skipGate = false) {
    playTone('pop');
    const u = RASTI_DATA.user;

    // Restricción para padres (Verificación de Adulto Responsable según el documento)
    if (!skipGate && !state.parentPanelUnlocked) {
      const gateHtml = `
        <div style="text-align:center;padding:8px 10px;">
          <span style="background:#fef3c7;border:2px solid #f59e0b;color:#78350f;padding:5px 14px;border-radius:999px;font-family:var(--font-btn);font-size:0.8rem;font-weight:700;">
            🔒 ACCESO RESTRINGIDO • SOLO PADRES / ADULTO RESPONSABLE
          </span>
          <h2 style="font-family:var(--font-title);font-size:1.55rem;color:var(--rasti-navy);margin-top:10px;">
            VERIFICACIÓN PARENTAL
          </h2>
          <p style="font-family:var(--font-btn);font-size:0.9rem;color:#334155;max-width:460px;margin:6px auto 14px;">
            El adulto tiene un rol de supervisión para gestionar permisos de comunidad, publicaciones y consultar el historial. Resolvé para continuar:
          </p>
          <div style="background:#fff;border:2.5px solid #bae6fd;border-radius:20px;padding:16px;max-width:380px;margin:0 auto 12px;">
            <div style="font-family:var(--font-title);font-size:1.45rem;color:var(--rasti-navy);margin-bottom:12px;">
              ¿Cuánto es 6 × 3?
            </div>
            <div style="display:flex;justify-content:center;gap:12px;">
              <button type="button" class="btn-rasti btn-rasti-white" onclick="RastiApp.unlockParentalPanel(12)">12</button>
              <button type="button" class="btn-rasti btn-rasti-primary" onclick="RastiApp.unlockParentalPanel(18)">18</button>
              <button type="button" class="btn-rasti btn-rasti-white" onclick="RastiApp.unlockParentalPanel(24)">24</button>
            </div>
          </div>
        </div>
      `;
      openModal(gateHtml);
      return;
    }

    const historyList = (u.sharedHistory || []).map(item => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:6px 10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${item.img}" alt="${item.title}" style="width:44px;height:34px;border-radius:8px;object-fit:cover;border:1.5px solid #bae6fd;" />
          <div>
            <div style="font-family:var(--font-btn);font-weight:700;font-size:0.82rem;color:var(--rasti-navy);">${item.title}</div>
            <div style="font-family:var(--font-btn);font-size:0.72rem;color:#64748b;">${item.date} • 🧱 ${item.blocks} bloques</div>
          </div>
        </div>
        <span style="font-family:var(--font-btn);font-weight:700;font-size:0.72rem;padding:3px 9px;border-radius:999px;background:${item.status.includes('Aprobada') ? '#dcfce7' : '#fef9c3'};color:${item.status.includes('Aprobada') ? '#15803d' : '#854d0e'};">
          ${item.status.includes('Aprobada') ? '✓ ' : '⏳ '}${item.status}
        </span>
      </div>
    `).join('');

    const html = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;padding-right:38px;">
        <h2 style="font-family:var(--font-title);font-size:1.4rem;color:var(--rasti-navy);">
          🛡️ PANEL DE CONTROL DEL ADULTO RESPONSABLE
        </h2>
        <span style="background:#dcfce7;color:#15803d;font-family:var(--font-btn);font-weight:700;font-size:0.75rem;padding:3px 10px;border-radius:999px;">
          ✓ Adulto Verificado
        </span>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <!-- 1. Consentimiento Comunidad Familia Rasti -->
        <div style="background:#fff;border:2px solid #bae6fd;border-radius:16px;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <div>
            <div style="font-family:var(--font-btn);font-weight:700;font-size:0.88rem;color:var(--rasti-navy);">
              👨‍👩‍👧 Consentimiento para Comunidad «Familia Rasti» (+6 años)
            </div>
            <div style="font-family:var(--font-btn);font-size:0.74rem;color:#475569;">
              Autorizar participación del niño/a en la galería comunitaria segura.
            </div>
          </div>
          <button type="button" class="onb-toggle-btn ${u.parentalConsent ? 'active' : ''}" onclick="RastiApp.toggleParentalConsentFromPanel()">
            ${u.parentalConsent ? '✓ AUTORIZADO' : '🔒 BLOQUEADO'}
          </button>
        </div>

        <!-- 2. Habilitar / Deshabilitar Publicaciones -->
        <div style="background:#fff;border:2px solid #bae6fd;border-radius:16px;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <div>
            <div style="font-family:var(--font-btn);font-weight:700;font-size:0.88rem;color:var(--rasti-navy);">
              📷 Habilitar o Deshabilitar Publicaciones
            </div>
            <div style="font-family:var(--font-btn);font-size:0.74rem;color:#475569;">
              Permitir que el niño/a envíe fotos de sus construcciones a revisión de moderador.
            </div>
          </div>
          <button type="button" class="onb-toggle-btn ${u.publishingEnabled ? 'active' : ''}" onclick="RastiApp.togglePublishingFromPanel()">
            ${u.publishingEnabled ? '✓ HABILITADO' : '🔒 DESHABILITADO'}
          </button>
        </div>

        <!-- 3. Historial de Construcciones Compartidas -->
        <div style="background:#fff;border:2px solid #bae6fd;border-radius:16px;padding:8px 14px;">
          <div style="font-family:var(--font-btn);font-weight:700;font-size:0.86rem;color:var(--rasti-navy);margin-bottom:6px;">
            📋 Historial de Construcciones Compartidas (${(u.sharedHistory || []).length})
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;max-height:110px;overflow-y:auto;">
            ${historyList}
          </div>
        </div>

        <!-- 4. Edad configurada y Creador de Cuenta -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:#fff;border:2px solid #bae6fd;border-radius:16px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <span style="font-family:var(--font-btn);font-weight:700;font-size:0.82rem;color:var(--rasti-navy);">Edad:</span>
            <div style="display:flex;gap:5px;">
              <button type="button" class="btn-rasti ${u.ageGroup === '4-6' ? 'btn-rasti-yellow' : 'btn-rasti-white'}" style="padding:5px 10px;font-size:0.74rem;" onclick="RastiApp.setAgeGroup('4-6');RastiApp.openSettingsModal(true);">
                👶 4-6
              </button>
              <button type="button" class="btn-rasti ${u.ageGroup === '7-10' ? 'btn-rasti-yellow' : 'btn-rasti-white'}" style="padding:5px 10px;font-size:0.74rem;" onclick="RastiApp.setAgeGroup('7-10');RastiApp.openSettingsModal(true);">
                🧒 7-10
              </button>
            </div>
          </div>

          <div style="background:#fff;border:2px solid #bae6fd;border-radius:16px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">
            <span style="font-family:var(--font-btn);font-weight:700;font-size:0.82rem;color:var(--rasti-navy);">Registro inicial:</span>
            <button type="button" class="btn-rasti btn-rasti-primary" style="padding:5px 12px;font-size:0.74rem;" onclick="RastiApp.closeModal();RastiApp.openOnboarding(true);">
              CREAR CUENTA
            </button>
          </div>
        </div>
      </div>
    `;
    openModal(html);
  }

  function unlockParentalPanel(ans) {
    if (ans === 18) {
      state.parentPanelUnlocked = true;
      playTone('success');
      openSettingsModal(true);
    } else {
      playTone('click');
      showToast('🔒 Respuesta incorrecta. Panel exclusivo para padres (6 × 3 = 18).', '👨‍👩‍👧');
    }
  }

  function toggleParentalConsentFromPanel() {
    playTone('pop');
    RASTI_DATA.user.parentalConsent = !RASTI_DATA.user.parentalConsent;
    updateTopHud();
    openSettingsModal(true);
  }

  function togglePublishingFromPanel() {
    playTone('pop');
    RASTI_DATA.user.publishingEnabled = !RASTI_DATA.user.publishingEnabled;
    openSettingsModal(true);
  }

  // ==========================================================================
  // INICIALIZACIÓN Y SOPORTE DE HASH URL PARA DEMO
  // ==========================================================================
  function handleHashRoute() {
    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (!hash) return true;
    document.getElementById('onboarding-overlay')?.classList.remove('open');
    if (['inicio', 'personalizacion', 'modos', 'logros'].includes(hash)) {
      navigate(hash);
    } else if (hash === 'islas' || hash === 'aventura') {
      navigate('modos');
      switchModosView('islands');
    } else if (hash === 'familia') {
      navigate('modos');
      switchModosView('familia');
    } else if (hash === 'mundo-espacial') {
      navigate('inicio');
      openWorldModal('espacial');
    } else if (hash === 'scanner') {
      navigate('inicio');
      openScannerModal('Cohete Explorador X-1', 'Estación Espacial', 'assets/builds/build-rocket.jpg', 15);
    } else if (hash === 'onboarding') {
      openOnboarding(false);
    }
    return false;
  }

  // ==========================================================================
  // MODO APAISADO (LANDSCAPE) FORZADO EN MÓVILES Y BLOQUEO DE ZOOM
  // ==========================================================================
  function preventMobileZoom() {
    // Bloquear gestos de pellizco (pinch-to-zoom) en iOS Safari y Android
    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });

    document.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  function syncMobileLandscapeViewport() {
    const tablet = document.getElementById('tablet-frame');
    if (!tablet) return;

    const vv = window.visualViewport;
    const w = Math.round(vv ? vv.width : (document.documentElement.clientWidth || window.innerWidth));
    const h = Math.round(vv ? vv.height : (document.documentElement.clientHeight || window.innerHeight));
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const isPortrait = w < h;
    const isCompactOrMobile = isPortrait || isTouch || w < 1200 || h < 760;

    if (isCompactOrMobile) {
      document.documentElement.classList.add('mobile-landscape-html');
      document.body.classList.add('mobile-forced-landscape');

      // Intentar bloquear la rotación del navegador en vertical ("portrait") donde está soportado
      if (isTouch && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait-primary').catch(() => {});
      }

      // En móvil (isTouch), mantener SIEMPRE la orientación y proporción fija de "vertical" (rotate(90deg) sobre el eje largo del teléfono)
      // para que al inclinar o girar el celular en la mano no cambie ni se achique la vista
      const forceVerticalPhoneMode = isTouch || isPortrait;

      if (forceVerticalPhoneMode) {
        const longSide = Math.max(w, h);
        const shortSide = Math.min(w, h);
        const aspect = Math.min(2.05, Math.max(1.72, longSide / Math.max(1, shortSide)));

        const virtualH = 560;
        const virtualW = Math.round(virtualH * aspect);

        // Si el navegador sigue en vertical (w < h), rotamos 90deg para que quede acostado como se ve en vertical.
        // Si el sistema operativo del teléfono rotó el navegador a horizontal (w > h), mantenemos exactamente el mismo virtualW x virtualH
        const scale = isPortrait
          ? Math.min(h / virtualW, w / virtualH)
          : Math.min(w / virtualW, h / virtualH);

        tablet.style.width = `${virtualW}px`;
        tablet.style.height = `${virtualH}px`;
        tablet.style.left = `${w / 2}px`;
        tablet.style.top = `${h / 2}px`;
        tablet.style.transform = isPortrait
          ? `translate(-50%, -50%) rotate(90deg) scale(${scale})`
          : `translate(-50%, -50%) scale(${scale})`;
      } else {
        const aspect = w / Math.max(1, h);
        let virtualH = 560;
        let virtualW = Math.round(virtualH * aspect);
        if (virtualW < 960) {
          virtualW = 960;
          virtualH = Math.round(virtualW / aspect);
        }
        const scale = w / virtualW;
        tablet.style.width = `${virtualW}px`;
        tablet.style.height = `${virtualH}px`;
        tablet.style.left = `${w / 2}px`;
        tablet.style.top = `${h / 2}px`;
        tablet.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
    } else {
      document.documentElement.classList.remove('mobile-landscape-html');
      document.body.classList.remove('mobile-forced-landscape');
      tablet.style.width = '';
      tablet.style.height = '';
      tablet.style.left = '';
      tablet.style.top = '';
      tablet.style.transform = '';
    }
  }

  function init() {
    preventMobileZoom();
    syncMobileLandscapeViewport();
    updateTopHud();
    renderPersonalizacion();
    renderModos();
    renderLogros();

    const shouldShowOnboarding = handleHashRoute();
    let alreadyOnboarded = false;
    try {
      alreadyOnboarded = sessionStorage.getItem('rasti_onboarded') === '1';
    } catch (e) {}

    if (shouldShowOnboarding && !alreadyOnboarded) {
      openOnboarding(false);
    }

    window.addEventListener('hashchange', handleHashRoute);
    window.addEventListener('resize', syncMobileLandscapeViewport);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', syncMobileLandscapeViewport);
    }
    window.addEventListener('orientationchange', () => {
      setTimeout(syncMobileLandscapeViewport, 80);
      setTimeout(syncMobileLandscapeViewport, 250);
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    navigate,
    openOnboarding,
    verifyOnboardingParent,
    goOnboardingStep,
    updateOnboardingName,
    rollOnboardingAlias,
    selectExactAge,
    selectOnboardingAge,
    toggleOnboardingParental,
    toggleOnboardingPublishing,
    selectOnboardingAvatar,
    syncOnboardingPreview,
    finishOnboarding,
    openModoAventuraFromInicio,
    openFamiliaFromInicio,
    setAgeGroup,
    speakWelcome,
    toggleFullscreen,
    setCharacterGender,
    selectBaseProfile,
    selectCustomOption,
    selectClothingItem,
    selectSpecialSuit,
    selectAccessoryItem,
    filterCustomCategory,
    toggleCharacterZoom,
    toggleCharacterFlip,
    randomizeAvatar,
    saveAvatarCustomization,
    switchModosView,
    filterFamiliaTab,
    toggleLikePost,
    toggleSavePost,
    reportPost,
    claimChallengeReward,
    openWorldModal,
    speakWorldStory,
    openScannerModal,
    confirmScannedBuild,
    openStoryMovieModal,
    openShareCreationModal,
    submitCreationForModeration,
    openPostDetailModal,
    openMedalModal,
    openNotificationsModal,
    openSettingsModal,
    unlockParentalPanel,
    toggleParentalConsentFromPanel,
    togglePublishingFromPanel,
    closeModal,
    closeModalOnBackdrop
  };
})();
