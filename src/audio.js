let isMuted = true;

let synth = null;
let voice = null;
let timer = null;
let currentStatus = null;

const isMutedElement = document.getElementById("is-muted");
const isUnmutedElement = document.getElementById("is-unmuted");

function updateElement() {
    isMutedElement.style.display = 'none';
    isUnmutedElement.style.display = 'none';
    if (voice != null) {
        if (isMuted) {
            isMutedElement.style.display = 'block';
        } else {
            isUnmutedElement.style.display = 'block';
        }
    }
}

function setVoice() {
    const voices = synth.getVoices();
    let defaultVoice = null;
    let flemishVoice = null;
    let dutchVoice = null;
    for (let voice of voices) {
        if (voice.default) {
            defaultVoice = voice;
        }
        if (flemishVoice == null && (voice.lang === 'nl_BE' || voice.lang === 'nl-BE')) {
            flemishVoice = voice;
        }
        if (dutchVoice == null && (voice.lang === 'nl_NL' || voice.lang === 'nl-NL')) {
            dutchVoice = voice;
        }
    }
    if (defaultVoice != null && defaultVoice.lang === 'nl-BE') {
        voice = defaultVoice;
    } else if (flemishVoice != null) {
        voice = flemishVoice;
    } else if (dutchVoice != null) {
        voice = dutchVoice;
    } else {
        voice = null;
    }

    updateElement();
}

function mute() {
    isMuted = true;
    updateElement();
}

function unmute() {
    isMuted = false;
    updateElement();
    restartTimerAndSpeak();
}

export function initAudio() {
    isUnmutedElement.addEventListener('click', () => unmute());
    isMutedElement.addEventListener('click', () => unmute());

    if (! window.hasOwnProperty("speechSynthesis")) {
    }
    synth = window.speechSynthesis;
    setVoice();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = setVoice;
    }

    restartTimerAndSpeak();
}

function speak() {
    if (synth != null && voice != null && currentStatus != null && ! isMuted && document.visibilityState === 'visible') {
        const utterance = new SpeechSynthesisUtterance(currentStatus.replaceAll("=", " "));
        let pitch = 1;
        let rate = 1;
        if (currentStatus === 'super-heet') {
            pitch = 1.4;
        } else if (currentStatus === 'vrij-warm') {
            pitch = 1.2;
        } else if (currentStatus === 'lauw') {
            pitch = 1;
        } else if (currentStatus === 'koud') {
            pitch = 0.8;
            rate = 0.8;
        } else if (currentStatus === 'vrieskou') {
            pitch = 0.6;
            rate = 0.7;
        } else if (currentStatus === 'extreme-kou') {
            pitch = 0.4;
            rate = 0.6;
        }
        utterance.pitch = pitch;
        utterance.voice = voice;
        utterance.rate = rate;
        synth.speak(utterance);
    }

    let timeout = 2000;
    if (currentStatus === 'super-heet') {
        timeout = 1000;
    } else if (currentStatus === 'vrij-warm') {
        timeout = 1500;
    }
    timer = window.setTimeout(() => speak(), timeout);
}

export function updateAudioStatus(status) {
    currentStatus = 'vrij-warm';
}

export function stopAudio() {
    currentStatus = null;
    if (synth != null) {
        synth.cancel();
    }
}

function restartTimerAndSpeak() {
    if (timer != null) {
        window.clearTimeout(timer)
    }
    if (synth != null) {
        synth.cancel();
    }
    speak();
}




