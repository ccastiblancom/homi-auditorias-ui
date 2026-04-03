export const flujoHospitalizacion = {
    titulo: "HOSPITALIZACIÓN",
    puntosControl: [
      {
        nombre: "1. Presalidas (Gestión Anticipada)",
        preguntas: [
          {
            id: "H-1-1",
            pregunta: "¿Se cumple con la ejecución de las presalidas programadas para el día, asegurando que el paciente cuente con la orden de egreso antes del mediodía?",
            prueba: "Cotejo entre el listado de las 18 presalidas programadas vs. las 12 ejecutadas.",
            criterio: "La efectividad de ejecución debe ser ≥ 80% (actualmente 67%)."
          },
          {
            id: "H-1-2",
            pregunta: "¿Existe un protocolo de solicitud anticipada de oxígeno (mínimo 24 horas antes) que prevenga el retraso en el egreso del paciente?",
            prueba: "Revisión de los registros de solicitud de oxígeno para los casos que representan el 35% del incumplimiento.",
            criterio: "El 100% de los pacientes con requerimiento de oxígeno deben tener el equipo gestionado y confirmado previo al día del egreso."
          },
          {
            id: "H-1-3",
            pregunta: "¿Los trámites de egreso administrativo (autorizaciones de salida, transporte, copagos) se inician de forma concurrente con la evolución médica?",
            prueba: "Auditoría de los tiempos de respuesta de la oficina de admisiones/facturación para el 25% de los casos de incumplimiento bajo la causa 'Trámites PHD'.",
            criterio: "El trámite administrativo no debe exceder las 2 horas tras la firma de la orden médica de presalida."
          },
          {
            id: "H-1-4",
            pregunta: "¿Se garantizó la realización de laboratorios, curaciones o procedimientos finales antes de la hora programada de la presalida?",
            prueba: "Revisión de la causa de incumplimiento del 20% (Pendientes clínicos). Verificar si hubo retraso en la ronda médica o apoyos.",
            criterio: "El 100% de los pendientes clínicos deben estar resueltos al menos 2 horas antes de la hora proyectada de salida."
          },
          {
            id: "H-1-5",
            pregunta: "¿Se cuenta con un trabajador social o gestor de casos que gestione oportunamente el cupo en albergues o transporte especial para pacientes vulnerables?",
            prueba: "Verificación del tiempo de gestión para el 12% de incumplimientos por 'Albergue no disponible'.",
            criterio: "La gestión de soporte social debe iniciarse al menos 48 horas antes del egreso proyectado para evitar bloqueos de cama."
          }
        ]
      },
      {
        nombre: "2. Egresos (Eficiencia en el Cierre)",
        preguntas: [
          {
            id: "H-2-1",
            pregunta: "¿Se garantiza que el médico tratante realice la ronda y registre el egreso en el sistema antes de las 10:00 AM para activar la cadena logística?",
            prueba: "Análisis de la columna 'Médico' en la consola de egresos. Casos críticos como Torres D., C. (10:45 AM).",
            criterio: "El 80% de los clics de egreso médico deben ocurrir antes de las 10:00 AM."
          },
          {
            id: "H-2-2",
            pregunta: "¿Existe un flujo ágil entre enfermería y farmacia para el cierre de la cuenta de medicamentos una vez se ordena el egreso?",
            prueba: "Medición del tiempo entre el clic médico y la validación de farmacia. Promedio actual: 18 min.",
            criterio: "El tiempo de devolución de medicamentos no debe superar los 10 minutos."
          },
          {
            id: "H-2-3",
            pregunta: "¿Se realizan las actividades de cierre clínico y el cierre de facturación de forma concurrente para evitar estancias innecesarias?",
            prueba: "Comparativa de tiempos en la consola. Promedio general de 25 min en facturación.",
            criterio: "El tiempo de facturación debe ser ≤ 15 minutos."
          },
          {
            id: "H-2-4",
            pregunta: "¿La notificación de 'Cama Desocupada' se realiza inmediatamente después de la salida física del paciente o existen demoras administrativas?",
            prueba: "Análisis del Clic de Liberación. El tablero muestra un promedio de 35 min (excede meta).",
            criterio: "El tiempo entre facturación y liberación debe ser ≤ 20 minutos."
          },
          {
            id: "H-2-5",
            pregunta: "¿El personal de servicios generales responde oportunamente al llamado de limpieza para garantizar el 'Giro-Cama'?",
            prueba: "Revisión del tiempo de Limpieza Promedio (42 min). Identificación de cuellos de botella.",
            criterio: "El tiempo de limpieza terminal debe ser ≤ 30 minutos."
          }
        ]
      },
      {
        nombre: "3. Estancias por Diagnóstico",
        preguntas: [
          {
            id: "H-3-1",
            pregunta: "¿Existen protocolos clínicos de manejo estandarizados que justifiquen las desviaciones superiores a 1 día en diagnósticos de alta complejidad (Fractura de fémur e ICC)?",
            prueba: "Comparativa entre la guía de práctica clínica institucional vs. el registro en la HC para pacientes con Fractura de fémur (8.4d).",
            criterio: "La desviación acumulada no debe superar la meta institucional de 4.2 días de estancia promedio."
          },
          {
            id: "H-3-2",
            pregunta: "¿El diagnóstico registrado al ingreso coincide con el diagnóstico de egreso y los procedimientos realizados durante la hospitalización?",
            prueba: "Auditoría de calidad de registros para validar la Concordancia DX (88%).",
            criterio: "La concordancia diagnóstica debe ser ≥ 90% para garantizar un análisis GRD confiable."
          },
          {
            id: "H-3-3",
            pregunta: "¿Se están cumpliendo los hitos terapéuticos diarios en pacientes con Insuficiencia Cardíaca Congestiva (ICC) para evitar la estancia prolongada?",
            prueba: "Revisión del plan de manejo diario para casos de ICC. Verificar si la desviación de +1.3d se debe a descompensaciones.",
            criterio: "La estancia para ICC debe tender a la meta esperada de 5.5 días."
          },
          {
            id: "H-3-4",
            pregunta: "¿El manejo de patologías de baja complejidad (Apendicitis y Bronquiolitis) se mantiene dentro del rango de eficiencia para liberar camas rápidamente?",
            prueba: "Análisis de los tiempos de respuesta en casos de Apendicitis (3.1d).",
            criterio: "Los diagnósticos de baja complejidad no deben presentar desviaciones superiores a 0.2 días respecto a la meta."
          },
          {
            id: "H-3-5",
            pregunta: "¿La variabilidad observada en Neumonía (+0.7d) responde a factores de comorbilidad o a ineficiencias en el inicio de tratamiento?",
            prueba: "Revisión de la oportunidad del inicio de tratamiento en casos de Neumonía (J18).",
            criterio: "Reducción de la variabilidad clínica no justificada en el 100% de los casos de complejidad media."
          }
        ]
      }
    ]
  };