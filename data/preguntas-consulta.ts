export const flujoConsulta = {
    titulo: "CONSULTA EXTERNA",
    puntosControl: [
      {
        nombre: "1. Agendamiento y Mallas",
        preguntas: [
          {
            id: "CE-1-1",
            pregunta: "¿Se cumple con el estándar de días de espera definido institucionalmente para la asignación de citas en especialidades críticas?",
            prueba: "Comparativa entre la meta de días vs. la realidad reportada. Análisis específico de la brecha en especialidades.",
            criterio: "Los días de espera no deben superar la meta establecida para cada especialidad."
          },
          {
            id: "CE-1-2",
            pregunta: "¿Existen estrategias efectivas de confirmación de citas (llamadas, SMS, correos) para mitigar el impacto de las citas incumplidas?",
            prueba: "Análisis de citas incumplidas. Verificar contacto previo 48-72 horas antes y proceso de reasignación.",
            criterio: "La tasa de inasistencia debe ser monitoreada y gestionada para no superar el 10% del total de la agenda."
          },
          {
            id: "CE-1-3",
            pregunta: "¿Se clasifican y analizan las causas de las citas canceladas para identificar fallos imputables a la institución vs. paciente?",
            prueba: "Revisión del log de cancelaciones del día. Verificar si fueron reprogramadas en menos de 5 días hábiles.",
            criterio: "El 100% de las citas canceladas por el prestador deben contar con un plan de reprogramación inmediata."
          },
          {
            id: "CE-1-4",
            pregunta: "¿Se ajusta la oferta de la malla en servicios de alta demanda como Terapia Física para corregir desviaciones en la oportunidad?",
            prueba: "Evaluación del indicador de Terapia Física. Determinar si requiere ampliación de malla u optimización.",
            criterio: "La oportunidad en servicios de apoyo terapéutico debe mantenerse alineada con la meta de 5 días."
          },
          {
            id: "CE-1-5",
            pregunta: "¿La relación entre citas cumplidas y la malla de especialistas disponible garantiza el uso óptimo de la infraestructura física?",
            prueba: "Cálculo de la ocupación de la malla. Verificar subutilización de especialidades.",
            criterio: "La ocupación global de la malla de consulta externa debe ser ≥ 85%."
          }
        ]
      },
      {
        nombre: "2. Admisión y Facturación",
        preguntas: [
          {
            id: "CE-2-1",
            pregunta: "¿Se garantiza que el tiempo de espera del paciente desde su llegada hasta ser atendido en ventanilla se mantenga dentro del estándar?",
            prueba: "Contraste entre el ticket de llegada vs. la hora de inicio de atención en el módulo.",
            criterio: "El tiempo de espera debe ser < 10 minutos."
          },
          {
            id: "CE-2-2",
            pregunta: "¿Existen causas identificadas que justifiquen que los tiempos máximos de atención lleguen hasta los 18 minutos?",
            prueba: "Revisión de los casos atípicos en los módulos donde el tiempo máximo fue alto.",
            criterio: "El tiempo máximo de atención no debería exceder en más de un 50% al tiempo promedio del módulo."
          },
          {
            id: "CE-2-3",
            pregunta: "¿Es equitativa la distribución de la carga de trabajo entre los módulos para asegurar un flujo constante?",
            prueba: "Comparativa de productividad entre facturadores (pacientes atendidos y tiempo promedio).",
            criterio: "La variabilidad de productividad entre facturadores no debe superar el 20%."
          },
          {
            id: "CE-2-4",
            pregunta: "¿Se realiza la validación completa de derechos y la recaudación de copagos de acuerdo con la normativa vigente?",
            prueba: "Auditoría aleatoria de los cierres de caja y soportes de autorización generados por los módulos.",
            criterio: "El cumplimiento de los requisitos de admisión y facturación debe ser ≥ 95%."
          },
          {
            id: "CE-2-5",
            pregunta: "¿El proceso de facturación se completa con la antelación suficiente para que el paciente esté en sala de espera antes del llamado médico?",
            prueba: "Medición del intervalo entre el fin de la facturación y la hora programada de la cita.",
            criterio: "El proceso de admisión debe finalizar al menos 5 minutos antes de la hora pactada de la cita médica."
          }
        ]
      },
      {
        nombre: "3. Toma de Signos (Pre-consulta)",
        preguntas: [
          {
            id: "CE-3-1",
            pregunta: "¿Se cumple con el estándar de tiempo de espera desde que el paciente finaliza su admisión hasta que es llamado para signos vitales?",
            prueba: "Contraste entre hora de finalización en facturación vs. hora de llamado a Toma de Signos.",
            criterio: "El tiempo de espera para pre-consulta debe ser ≤ 5 minutos."
          },
          {
            id: "CE-3-2",
            pregunta: "¿El tiempo dedicado a la toma de signos es suficiente para garantizar la precisión sin generar retrasos en el inicio de la consulta?",
            prueba: "Evaluación del Tiempo de Atención frente a la meta de 5 min.",
            criterio: "El tiempo de atención promedio debe oscilar entre 3 y 5 minutos."
          },
          {
            id: "CE-3-3",
            pregunta: "¿Existen factores identificados que justifiquen tiempos máximos de hasta 10 minutos en la toma de signos?",
            prueba: "Revisión de los registros de tiempo máximo. Verificar impacto en la cita médica.",
            criterio: "Los tiempos máximos no deben superar el doble del tiempo promedio de atención."
          },
          {
            id: "CE-3-4",
            pregunta: "¿La carga de pacientes está distribuida de manera equitativa entre los auxiliares disponibles?",
            prueba: "Comparativa de volumen de pacientes atendidos por auxiliar.",
            criterio: "La diferencia de carga entre módulos no debe ser superior al 25%."
          },
          {
            id: "CE-3-5",
            pregunta: "¿Se garantiza que el 100% de los signos vitales tomados se carguen inmediatamente en la historia clínica electrónica?",
            prueba: "Auditoría de historias clínicas para validar el Cumplimiento (94%). Identificar causas de la brecha.",
            criterio: "El registro de signos vitales debe ser inmediato y completo en el 100% de los casos."
          }
        ]
      },
      {
        nombre: "4. Consulta y/o Procedimiento",
        preguntas: [
          {
            id: "CE-4-1",
            pregunta: "¿Se cumple con el estándar de puntualidad para el inicio de la consulta médica una vez superadas facturación y pre-consulta?",
            prueba: "Comparativa entre la hora programada de la cita vs. la hora real de llamado al consultorio.",
            criterio: "El tiempo de espera para el inicio de la consulta debe ser ≤ 10 minutos."
          },
          {
            id: "CE-4-2",
            pregunta: "¿El tiempo de duración de la consulta se ajusta a los estándares institucionales sin comprometer la puntualidad?",
            prueba: "Evaluación del Tiempo de Atención. Análisis de variabilidad entre profesionales.",
            criterio: "El tiempo promedio de atención debe ser coherente con la especialidad (15-20 min)."
          },
          {
            id: "CE-4-3",
            pregunta: "¿Se documentan las causas por las cuales algunas consultas exceden significativamente el tiempo promedio?",
            prueba: "Revisión de historias clínicas para identificar si los máximos se deben a procedimientos, primera vez o educación compleja.",
            criterio: "Los tiempos máximos no deben generar un retraso acumulado que supere los 20 minutos."
          },
          {
            id: "CE-4-4",
            pregunta: "¿Se garantiza que el número de pacientes atendidos sea coherente con la disponibilidad de la malla para maximizar la capacidad?",
            prueba: "Análisis de productividad por médico. Verificar si la menor productividad se debe a inasistencias o complejidad.",
            criterio: "El cumplimiento global del servicio debe ser ≥ 90%."
          },
          {
            id: "CE-4-5",
            pregunta: "¿Se asegura que al finalizar la consulta el paciente cuente con el 100% de sus órdenes médicas, fórmulas y citas de control?",
            prueba: "Verificación aleatoria de egresos para validar completitud del plan de manejo.",
            criterio: "El 100% de los pacientes deben salir con su conducta clínica definida y documentada."
          }
        ]
      },
      {
        nombre: "5. Postconsulta (Gestión de Órdenes)",
        preguntas: [
          {
            id: "CE-5-1",
            pregunta: "¿Se garantiza que el tiempo de espera desde que sale del consultorio hasta que es atendido para la entrega de órdenes no supere 10 minutos?",
            prueba: "Cotejo entre hora de cierre de consulta médica vs. llamado en Postconsulta.",
            criterio: "El tiempo de espera en postconsulta debe ser ≤ 10 minutos."
          },
          {
            id: "CE-5-2",
            pregunta: "¿El tiempo de atención permite realizar una explicación clara de la preparación para exámenes y uso de medicamentos?",
            prueba: "Evaluación del Tiempo de Atención y análisis de variabilidad entre auxiliares.",
            criterio: "El tiempo de atención promedio debe ser ≤ 10 minutos."
          },
          {
            id: "CE-5-3",
            pregunta: "¿Existen causas administrativas o técnicas que justifiquen tiempos máximos de hasta 18 minutos?",
            prueba: "Análisis de casos atípicos. Verificar si fue por complejidad de órdenes o problemas de sistema.",
            criterio: "Los tiempos máximos no deben exceder el doble del promedio institucional."
          },
          {
            id: "CE-5-4",
            pregunta: "¿Se asegura que el paciente reciba la totalidad de sus soportes clínicos y administrativos antes de abandonar la institución?",
            prueba: "Auditoría de soportes entregados. Identificar si hay órdenes en 'borrador' o no impresas.",
            criterio: "El cumplimiento en la entrega de órdenes debe ser del 100%."
          },
          {
            id: "CE-5-5",
            pregunta: "¿La carga de trámites administrativos está balanceada entre los auxiliares para evitar cuellos de botella?",
            prueba: "Comparativa de volumen de pacientes atendidos en postconsulta.",
            criterio: "La variabilidad en la carga de trabajo no debe superar el 20%."
          }
        ]
      },
      {
        nombre: "6. Sala de Quimioterapia",
        preguntas: [
          {
            id: "CE-6-1",
            pregunta: "¿Existen barreras logísticas o técnicas en la central de mezclas que impidan cumplir con el estándar de preparación oncológica?",
            prueba: "Análisis de la causa raíz de la alerta roja en 'Prep. Farmacia'. Verificación de tiempos de validación.",
            criterio: "El tiempo de preparación en farmacia no debe exceder los 30 minutos."
          },
          {
            id: "CE-6-2",
            pregunta: "¿Se garantiza que el flujo del paciente (Admisión → Lab → Farmacia → Aplicación) se realice sin interrupciones?",
            prueba: "Auditoría de expedientes para identificar en qué punto se rompe el cumplimiento de la ruta.",
            criterio: "El cumplimiento de la Ruta Cáncer debe ser ≥ 95%."
          },
          {
            id: "CE-6-3",
            pregunta: "¿El tiempo de aplicación del tratamiento es coherente con el protocolo específico de cada esquema de quimioterapia?",
            prueba: "Verificación del tiempo promedio de Aplicación frente a órdenes médicas. Validación de supervisión.",
            criterio: "El tiempo de aplicación debe ajustarse estrictamente al protocolo clínico."
          },
          {
            id: "CE-6-4",
            pregunta: "¿Se cuenta con los resultados de laboratorios de control en el tiempo requerido para autorizar el inicio de la preparación?",
            prueba: "Medición del intervalo entre llegada del paciente a admisión y reporte de laboratorios.",
            criterio: "Los laboratorios de soporte deben estar disponibles en un máximo de 30 minutos."
          },
          {
            id: "CE-6-5",
            pregunta: "¿Cuál es el plan de contingencia y comunicación cuando el sistema detecta una espera superior a 30 minutos en preparación?",
            prueba: "Verificación de las notas de seguimiento para determinar causas de demoras críticas.",
            criterio: "Toda alerta de 'Excede 30 min' debe tener una justificación registrada."
          }
        ]
      }
    ]
  };