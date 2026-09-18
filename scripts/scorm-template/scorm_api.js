/* ------------------------------------------------------------------
   SCORM-1.2-Wrapper
   Herkunft: abgeleitet von scorm_api.js aus Pascal Ruschs Paketen
   «Herausforderungen B und C (1.1)», Mail vom 17.09.2026.
   Ergaenzt um die Messung von cmi.suspend_data (SCORM 1.2 begrenzt das
   Feld auf 4096 Zeichen — bei unseren Textmengen ist das knapp, also
   messen wir es, statt es zu hoffen).

   - Sucht die LMS-API im Fenster-/Frame-Baum (Standard-Discovery)
   - Faellt ausserhalb eines LMS (lokaler Test) auf localStorage zurueck
   ------------------------------------------------------------------ */
const ScormAPI = (function () {
  let api = null;
  let initialized = false;
  let usingFallback = false;

  /* SCORM 1.2, Datenmodell: cmi.suspend_data ist ein CMIString4096. Mehr
     darf eine konforme Laufzeitumgebung abschneiden oder mit einem Fehler
     ablehnen. Wir schneiden nie selbst ab, sondern melden die Ueberschreitung
     nach oben — sonst verschwinden Antworten lautlos. */
  const SUSPEND_LIMIT = 4096;
  let lastSuspendLen = 0;
  let overflowHandler = null;

  function findAPI(win) {
    let attempts = 0;
    let w = win;
    while (w && !w.API && w.parent && w.parent !== w && attempts < 500) {
      attempts++;
      w = w.parent;
    }
    return w ? w.API : null;
  }

  function locateAPI() {
    let theAPI = findAPI(window);
    if (!theAPI && window.opener) {
      theAPI = findAPI(window.opener);
    }
    return theAPI;
  }

  function init() {
    api = locateAPI();
    if (api) {
      const result = api.LMSInitialize("");
      initialized = (result === "true" || result === true);
      usingFallback = !initialized;
    } else {
      usingFallback = true;
    }
    if (usingFallback) {
      console.info("Kein LMS gefunden – lokaler Offline-Modus (localStorage) aktiv.");
    }
    return true;
  }

  function getValue(key) {
    if (!usingFallback && api) {
      return api.LMSGetValue(key);
    }
    return localStorage.getItem("scorm_" + key) || "";
  }

  function setValue(key, value) {
    if (!usingFallback && api) {
      api.LMSSetValue(key, value);
    } else {
      localStorage.setItem("scorm_" + key, value);
    }
  }

  function commit() {
    if (!usingFallback && api) {
      api.LMSCommit("");
    }
  }

  function finish() {
    if (!usingFallback && api) {
      api.LMSFinish("");
    }
  }

  /* Die Antworten gehen IMMER zusaetzlich in den localStorage. Wenn das LMS
     suspend_data beschneidet, ist der Browser des Lernenden die zweite Kopie —
     und der Ausdruck der Leistungsdokumentation die dritte. */
  function saveSuspendData(obj) {
    const json = JSON.stringify(obj);
    lastSuspendLen = json.length;
    try {
      localStorage.setItem("hko_backup_" + (window.HKO_UNIT_ID || "unit"), json);
    } catch (e) {
      /* privates Fenster, volle Quota: kein Grund, die Bearbeitung abzubrechen */
    }
    setValue("cmi.suspend_data", json);
    commit();
    if (lastSuspendLen > SUSPEND_LIMIT && overflowHandler) {
      overflowHandler(lastSuspendLen, SUSPEND_LIMIT);
    }
  }

  function loadSuspendData() {
    let raw = getValue("cmi.suspend_data");
    /* Kam vom LMS nichts oder etwas abgeschnittenes zurueck, ist die lokale
       Kopie die bessere Quelle. */
    let parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch (e) { parsed = null; }
    if (!parsed) {
      try {
        const backup = localStorage.getItem("hko_backup_" + (window.HKO_UNIT_ID || "unit"));
        if (backup) parsed = JSON.parse(backup);
      } catch (e) { parsed = null; }
    }
    return parsed || {};
  }

  function setStatus(status) {
    // status: "incomplete" | "completed" | "passed"
    setValue("cmi.core.lesson_status", status);
    commit();
  }

  function setScore(scaled0to100) {
    setValue("cmi.core.score.raw", String(Math.round(scaled0to100)));
    setValue("cmi.core.score.min", "0");
    setValue("cmi.core.score.max", "100");
    commit();
  }

  return {
    init, getValue, setValue, commit, finish,
    saveSuspendData, loadSuspendData, setStatus, setScore,
    isFallback: () => usingFallback,
    suspendLength: () => lastSuspendLen,
    suspendLimit: () => SUSPEND_LIMIT,
    onSuspendOverflow: (fn) => { overflowHandler = fn; }
  };
})();
