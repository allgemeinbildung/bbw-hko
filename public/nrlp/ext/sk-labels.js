// Spiegel von src/lib/sk-labels.generated.ts — voller Bildungsrat-Satz → Kurzlabel.
// Bei Änderungen an der nRLP-Quelle (npm run build:sk-labels) hier nachziehen.
export const SK_FULL_TO_SHORT = {
  "Zwischen relevanten und irrelevanten Quellen und Inhalten unterscheiden": "Quellen unterscheiden",
  "Sich selbst Ziele setzen, die Zielsetzung überprüfen und sich adaptiv verhalten": "Ziele setzen und anpassen",
  "Antizipative, unternehmerische und innovative Wege der Problemlösung erkennen, entwickeln und umsetzen": "Innovation und Problemlösungen entwickeln",
  "In unterschiedlichen Teams zielgerichtet und effizient arbeiten": "In Teams arbeiten",
  "Die eigenen Werthaltungen und Überzeugungen erkennen, verstehen, kritisch reflektieren und weiterentwickeln": "Werthaltungen reflektieren",
  "Ihre eigenen Standpunkte begründen und andere davon überzeugen": "Standpunkte begründen",
  "Unterschiedliche Standpunkte nachvollziehen und das gegenseitige Verständnis fördern": "Verständnis fördern",
  "Ihre Lebensphasen planen und mit Unwägbarkeiten umgehen": "Lebensphasen planen",
  "Vernetzt und systemisch denken, um sozial, ökologisch und ökonomisch nachhaltig zu handeln": "Nachhaltig handeln",
  "Sich in einem sich ständig verändernden Umfeld zurechtfinden und sich an dieses anpassen": "Mit Wandel umgehen (Anpassung)",
  "Sich in einem ständig verändernden Umfeld zurechtfinden und sich an dieses anpassen": "Mit Wandel umgehen (Anpassung)",
  "Mit Mehrdeutigkeiten umgehen": "Mit Mehrdeutigkeiten umgehen",
  "An gesellschaftlichen Prozessen partizipieren und Handlungsspielräume nutzen": "Partizipation"
};

export function skShort(full) { return SK_FULL_TO_SHORT[full] || full; }
