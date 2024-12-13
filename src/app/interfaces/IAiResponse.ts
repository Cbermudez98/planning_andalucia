interface PedagogicalProcess {
  motivation: string;
  priorKnowledgeExploration: string;
  confrontation: string;
  activity: string;
  evaluation: string;
}

export interface IAiResponse {
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
  code: '',
  plan: '001', // Número de planilla agregado
  date: '', // Fecha de la planeación
  unit: '', // Unidad
  grade: '', // Grado
  area: '', // Área de la clase
  thematicAxis: '', // Eje temático
  estimatedTime: '', // Tiempo estimado
  actualTime: '', // Tiempo real
  achievement:
    '',
  competencies: {
    argumentative: '',
    interpretative: '',
    propositional: '',
  },
  complementaryAdjustments:
    '',
  pedagogicalProcess: {
    motivation:
      '',
    priorKnowledgeExploration:
      '',
    confrontation:
      '',
    activity:
      '',
    evaluation:
      '',
  },
  resources: [
    'Tablero',
    'Cuadernos',
    'Lápices de colores',
    'Marcadores',
    'Material didáctico visual',
  ],
  observations:
    'Asegúrese de que todos los estudiantes participen activamente en la clase y realice ajustes si es necesario.',
});
