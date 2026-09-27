// Opciones y límites compartidos entre los formularios (cliente) y las rutas
// de API (servidor), para que la validación nunca se desincronice de lo que
// muestran los desplegables.

export const SUBJECTS = [
  "Matemática I",
  "Matemática II",
  "Matemática Numérica",
  "Matemática Discreta",
  "Estadística I",
  "Lenguajes de Programación",
  "Marketing Estratégico y Operativo",
];

// 10:00 a 20:00 cada media hora.
export const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 10; h <= 20; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 20) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
})();

export const MAX_LENGTH = {
  name: 80,
  email: 254,
  note: 1000,
  review: 1000,
};
