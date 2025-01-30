interface PedagogicalProcess {
  motivation: string;
  priorKnowledgeExploration: string;
  confrontation: string;
  activitySchool: string;
  activityHouse: string;
  evaluation: string;
}

export interface IAiResponse {
  id: string;
  code: string;
  plan: string;
  date: string;
  unit: string;
  grade: string;
  area: string;
  thematicAxis: string;
  estimatedTime: string;
  actualTime: string;
  achievement: string;
  competencies: {
    argumentative: string;
    interpretative: string;
    propositional: string;
  };
  complementaryAdjustments: string;
  pedagogicalProcess: PedagogicalProcess;
  resources: string[];
  observations: string;
}

export const exampleLesson = JSON.stringify({
  code: '001', // Código único para identificar la planeación
  plan: '001', // Número de planilla agregado
  date: '26 de enero de 2025', // Fecha de la planeación
  unit: 'Unidad 1: Introducción al color', // Nombre de la unidad
  grade: '3', // Grado escolar (3° grado en este caso)
  area: 'Artística', // Área temática de la clase
  thematicAxis: 'Los colores primarios y secundarios', // Eje temático o tema principal
  estimatedTime: '2 horas', // Tiempo estimado de la clase
  actualTime: '1 hora 45 minutos', // Tiempo real invertido en la clase
  achievement:
    'Identificar y combinar colores primarios para obtener colores secundarios.', // Logro esperado al finalizar la clase
  competencies: {
    argumentative:
      'Explicar cómo se forman los colores secundarios a partir de los primarios.',
    interpretative: 'Reconocer los colores primarios en objetos cotidianos.',
    propositional:
      'Proponer combinaciones de colores para proyectos artísticos.',
  },
  complementaryAdjustments:
    'Brindar atención individual a estudiantes con dificultades para distinguir colores.', // Ajustes adicionales necesarios
  pedagogicalProcess: {
    motivation:
      'Mostrar imágenes de obras de arte famosas que utilicen colores primarios y secundarios para captar la atención de los estudiantes.', // Cómo motivar a los estudiantes al inicio de la clase
    priorKnowledgeExploration:
      'Preguntar a los estudiantes si conocen los colores primarios y si saben cómo se combinan.', // Explorar conocimientos previos
    confrontation:
      'Realizar un experimento mezclando pinturas primarias para demostrar cómo se forman los colores secundarios.', // Actividad para confrontar conocimientos
    activitySchool:
      'En clase: Los estudiantes mezclarán pinturas en sus cuadernos de trabajo para crear diferentes combinaciones de colores secundarios y realizarán un dibujo utilizando estas mezclas.', // Actividad principal de la clase
    activityHouse:
      ' En casa: Los estudiantes realizaran actividades de colores secuntarios y dibujos',
    evaluation:
      'Observar y evaluar los trabajos de los estudiantes, verificando si lograron identificar y combinar correctamente los colores.', // Método de evaluación
  },
  resources: [
    'Tablero',
    'Cuadernos',
    'Pinturas (rojo, azul, amarillo)',
    'Pinceles',
    'Vasos con agua',
    'Papel para mezclar colores',
    'Proyector para mostrar imágenes',
  ],
  observations:
    'Se recomienda reforzar el tema con estudiantes que no logren identificar los colores primarios o secundarios. Además, asegurarse de que todos tengan acceso a los materiales.', // Observaciones adicionales
});
