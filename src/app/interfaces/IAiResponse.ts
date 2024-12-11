interface PedagogicalProcess {
  motivation: string;
  priorKnowledgeExploration: string;
  confrontation: string;
  activity: string;
  evaluation: string;
}

export interface IAiResponse {
  date: string;
  unit: number;
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
}

export const exampleLesson = JSON.stringify({
  date: 'octubre 17, 2024',
  unit: 1,
  grade: 'Comprensión Lectora',
  area: 'Comprensión Lectora',
  thematicAxis: 'Comprensión Lectora',
  estimatedTime: '60 minutos',
  actualTime: '55 minutos',
  achievement:
    'El estudiante será capaz de comprender y explicar el tema de la lectura.',
  competencies: {
    argumentative: 'Desarrollar habilidades argumentativas',
    interpretative: 'Interpretar textos de manera crítica',
    propositional: 'Proponer soluciones o ideas',
  },
  complementaryAdjustments: 'Adaptaciones para necesidades particulares',
  pedagogicalProcess: {
    motivation: 'La docente revisa los compromisos de la clase anterior.',
    priorKnowledgeExploration: 'Realización de dinámicas',
    confrontation: 'Preguntar a los estudiantes si conocen sobre el tema.',
    activity: 'Explicación del tema y conceptualización.',
    evaluation:
      'En clase: Los estudiantes transcribirán el concepto. En casa: colorear los dibujos.',
  },
});
