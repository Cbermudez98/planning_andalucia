/*
{
    "N°": "3",
    "Semana": "2",
    "Materia": "Castellano",
    "Fecha": "22-02-2025",
    "Grado": "5to",
    "Tema": "Verbos regulares",
    "Actividad": "Hacer una lista de verbos"
}
*/

export interface ICsvImport {
  n: string;
  Materia: string;
  Fecha: string;
  Grado: string;
  Tema: string;
  Actividad: string;
}
