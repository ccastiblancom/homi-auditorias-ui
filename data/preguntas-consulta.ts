export const flujoConsulta = {
  id: 'consulta',
  titulo: 'Auditoría de Consulta Externa',
  puntosControl: [
    {
      nombre: 'Punto de Control 1 - Agendamiento y Mallas',
      preguntas: [
        {
          pregunta: '¿Se cumple con el estándar de días de espera definido institucionalmente para la asignación de citas en especialidades críticas?',
          prueba: 'Comparativa entre la meta de días vs. la realidad reportada. Análisis específico de la brecha en Cardiología Pediátrica (12d / 7d) y Neurología (8d / 7d).',
          criterio: 'Los días de espera no deben superar la meta establecida para cada especialidad (señalizada con alerta roja en el tablero).'
        },
        {
          pregunta: '¿Existen estrategias efectivas de confirmación de citas (llamadas, SMS, correos) para mitigar el impacto de las citas incumplidas en la capacidad instalada?',
          prueba: 'Análisis de las 22 citas incumplidas. Verificar si existe registro de contacto previo con el paciente 48-72 horas antes de la cita y si se realizó el proceso de reasignación de esos espacios.',
          criterio: 'La tasa de inasistencia debe ser monitoreada y gestionada para no superar el 10% del total de la agenda.'
        },
        {
          pregunta: '¿Se clasifican y analizan las causas de las 18 citas canceladas para identificar fallos imputables a la institución (ausencia del médico, fallas de infraestructura) vs. causas del paciente?',
          prueba: 'Revisión del log de cancelaciones del día. Verificar si las citas canceladas por el hospital fueron reprogramadas en menos de 5 días hábiles.',
          criterio: 'El 100% de las citas canceladas por el prestador deben contar con un plan de reprogramación inmediata.'
        },
        {
          pregunta: '¿Se ajusta la oferta de la malla en servicios de alta demanda como Terapia Física para corregir desviaciones en la oportunidad?',
          prueba: 'Evaluación del indicador de Terapia Física (6d / 5d). Determinar si el exceso de demanda requiere una ampliación de la malla o una optimización de la rotación de consultorios.',
          criterio: 'La oportunidad en servicios de apoyo terapéutico debe mantenerse alineada con la meta de 5 días.'
        },
        {
          pregunta: '¿La relación entre citas cumplidas (142) y la malla de especialistas disponible garantiza el uso óptimo de la infraestructura física del hospital?',
          prueba: 'Cálculo de la ocupación de la malla. Verificar si las especialidades con mejores tiempos de espera (Oncología 2d/3d) tienen capacidad de absorber demanda de otras áreas o si su malla está subutilizada.',
          criterio: 'La ocupación global de la malla de consulta externa debe ser ≥ 85%.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 2 - Admisión y Facturación',
      preguntas: [
        {
          pregunta: '¿Se garantiza que el tiempo de espera del paciente desde su llegada hasta ser atendido en ventanilla se mantenga dentro del estándar institucional para evitar aglomeraciones?',
          prueba: 'Contraste entre el ticket de llegada del paciente vs. la hora de inicio de atención en el módulo. Análisis del promedio de 8.5 min frente a la meta de 10 min.',
          criterio: 'El tiempo de espera debe ser < 10 minutos.'
        },
        {
          pregunta: '¿Existen causas identificadas (fallas en sistema, trámites de alta complejidad o falta de documentos) que justifiquen que los tiempos máximos de atención lleguen hasta los 18 minutos?',
          prueba: 'Revisión de los casos atípicos en el Módulo M2 (Ramos P.), donde el tiempo máximo fue de 18 min, comparado con el promedio de 8 min.',
          criterio: 'El tiempo máximo de atención no debería exceder en más de un 50% al tiempo promedio del módulo.'
        },
        {
          pregunta: '¿Es equitativa la distribución de la carga de trabajo entre los módulos para asegurar un flujo constante de pacientes hacia los consultorios?',
          prueba: 'Comparativa de productividad: López M. (M1) atendió 45 pacientes con un promedio de 6 min, mientras Ramos P. (M2) atendió 38 pacientes con 8 min.',
          criterio: 'La variabilidad de productividad entre facturadores no debe superar el 20% para mantener la agilidad del servicio.'
        },
        {
          pregunta: '¿Se realiza la validación completa de derechos y la recaudación de copagos/cuotas moderadoras de acuerdo con la normativa vigente en cada turno de atención?',
          prueba: 'Auditoría aleatoria de los cierres de caja y soportes de autorización generados por los tres módulos (M1, M2, M3) frente al reporte de 91% de cumplimiento.',
          criterio: 'El cumplimiento de los requisitos de admisión y facturación debe ser ≥ 95% (actualmente hay una brecha del 4%).'
        },
        {
          pregunta: '¿El proceso de facturación se completa con la antelación suficiente para que el paciente esté disponible en sala de espera antes del llamado del médico?',
          prueba: 'Medición del intervalo entre el fin de la facturación y la hora programada de la cita.',
          criterio: 'El proceso de admisión y facturación debe finalizar al menos 5 minutos antes de la hora pactada de la cita médica.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 3 - Toma de Signos (Pre-consulta)',
      preguntas: [
        {
          pregunta: '¿Se cumple con el estándar de tiempo de espera desde que el paciente finaliza su admisión hasta que es llamado para la toma de signos vitales?',
          prueba: 'Contraste entre la hora de finalización en el módulo de facturación vs. la hora de llamado en los módulos de Toma de Signos (TS). Análisis del promedio de 3.1 min frente a la meta establecida.',
          criterio: 'El tiempo de espera para pre-consulta debe ser ≤ 5 minutos.'
        },
        {
          pregunta: '¿El tiempo dedicado a la toma de signos (tensión, peso, frecuencia, etc.) es suficiente para garantizar la precisión del dato sin generar retrasos en el inicio de la consulta médica?',
          prueba: 'Evaluación del Tiempo de Atención (4.2 min) frente a la meta de 5 min. Análisis de la variabilidad entre auxiliares (García: 3.8 min vs. Rodríguez: 4.5 min).',
          criterio: 'El tiempo de atención promedio debe oscilar entre 3 y 5 minutos.'
        },
        {
          pregunta: '¿Existen factores identificados (pacientes con movilidad reducida, fallas en equipos biomédicos) que justifiquen tiempos máximos de hasta 10 minutos en la toma de signos?',
          prueba: 'Revisión de los registros de tiempo máximo en el Módulo TS-2 (Aux. Rodríguez). Verificar si el retraso impactó el cumplimiento de la hora de la cita médica subsiguiente.',
          criterio: 'Los tiempos máximos no deben superar el doble del tiempo promedio de atención del módulo.'
        },
        {
          pregunta: '¿La carga de pacientes está distribuida de manera equitativa entre los auxiliares disponibles para evitar el agotamiento del personal y asegurar la agilidad del flujo?',
          prueba: 'Comparativa de volumen: Aux. Rodríguez atendió 32 pacientes, mientras que Aux. Díaz atendió 25.',
          criterio: 'La diferencia de carga entre módulos no debe ser superior al 25% para mantener un flujo balanceado.'
        },
        {
          pregunta: '¿Se garantiza que el 100% de los signos vitales tomados se carguen inmediatamente en la historia clínica electrónica para que el médico los visualice al momento del llamado?',
          prueba: 'Auditoría de historias clínicas para validar el Cumplimiento (94%). Identificar las causas del 6% de brecha (omisión de registros o fallas de sincronización).',
          criterio: 'El registro de signos vitales debe ser inmediato y completo en el 100% de los casos atendidos.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 4 - Consulta y/o Procedimiento',
      preguntas: [
        {
          pregunta: '¿Se cumple con el estándar de puntualidad para el inicio de la consulta médica una vez que el paciente ha superado las etapas de facturación y pre-consulta?',
          prueba: 'Comparativa entre la hora programada de la cita vs. la hora real de llamado al consultorio. Análisis del promedio de 12 min frente a la meta de 10 min.',
          criterio: 'El tiempo de espera para el inicio de la consulta debe ser ≤ 10 minutos.'
        },
        {
          pregunta: '¿El tiempo de duración de la consulta se ajusta a los estándares institucionales, permitiendo una evaluación clínica completa sin comprometer la puntualidad de la agenda?',
          prueba: 'Evaluación del Tiempo de Atención (18 min). Análisis de la variabilidad entre profesionales: Dr. Hernández (15 min) vs. Dra. Vargas (20 min).',
          criterio: 'El tiempo promedio de atención debe ser coherente con el tipo de especialidad (rango esperado 15-20 min).'
        },
        {
          pregunta: '¿Se documentan las causas por las cuales algunas consultas exceden significativamente el tiempo promedio, llegando a máximos de 35 minutos?',
          prueba: 'Revisión de las historias clínicas en el Consultorio C-02 (Dra. Vargas) para identificar si los tiempos máximos se deben a procedimientos en consultorio, pacientes de primera vez o educación compleja.',
          criterio: 'Los tiempos máximos no deben generar un retraso acumulado que supere los 20 minutos al final de la jornada.'
        },
        {
          pregunta: '¿Se garantiza que el número de pacientes atendidos por consultorio sea coherente con la disponibilidad de la malla para maximizar la capacidad instalada?',
          prueba: 'Análisis de productividad: Dr. Hernández (16 pacientes) vs. Dr. Peña (12 pacientes). Verificar si la menor productividad se debe a inasistencias o a la complejidad de la especialidad.',
          criterio: 'El cumplimiento global del servicio debe ser ≥ 90% (actualmente 88%).'
        },
        {
          pregunta: '¿Se asegura que al finalizar la consulta el paciente cuente con el 100% de sus órdenes médicas, fórmulas y citas de control debidamente cargadas en el sistema?',
          prueba: 'Verificación aleatoria de egresos de consulta externa para validar la completitud del plan de manejo y la entrega de documentos al paciente.',
          criterio: 'El 100% de los pacientes deben salir del consultorio con su conducta clínica definida y documentada.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 5 - Postconsulta (Gestión de Órdenes)',
      preguntas: [
        {
          pregunta: '¿Se garantiza que el tiempo de espera del paciente desde que sale del consultorio hasta que es atendido para la entrega de órdenes no supere los 10 minutos?',
          prueba: 'Cotejo entre la hora de cierre de la consulta médica vs. la hora de llamado en los módulos de Postconsulta (PC). Análisis del promedio de 5.4 min frente a la meta.',
          criterio: 'El tiempo de espera en postconsulta debe ser ≤ 10 minutos.'
        },
        {
          pregunta: '¿El tiempo de atención por módulo permite realizar una explicación clara de la preparación para exámenes y el uso de medicamentos sin exceder la meta de 10 minutos?',
          prueba: 'Evaluación del Tiempo de Atención (8.3 min). Análisis de la variabilidad: Aux. Salazar (7 min) vs. Aux. Moreno (9 min).',
          criterio: 'El tiempo de atención promedio debe ser ≤ 10 minutos.'
        },
        {
          pregunta: '¿Existen causas administrativas o técnicas (fallas de impresora, falta de sellos, órdenes no cargadas por el médico) que justifiquen tiempos máximos de hasta 18 minutos?',
          prueba: 'Análisis de los casos atípicos en el Módulo PC-2 (Aux. Moreno). Verificar si el retraso se debió a la complejidad de las órdenes o a problemas con el sistema de información.',
          criterio: 'Los tiempos máximos no deben exceder el doble del promedio institucional.'
        },
        {
          pregunta: '¿Se asegura que el paciente reciba la totalidad de sus soportes clínicos y administrativos antes de abandonar la institución?',
          prueba: 'Auditoría de los soportes entregados frente al registro de 87% de cumplimiento. Identificar si la brecha del 13% corresponde a órdenes que quedaron en estado "borrador" o que no fueron impresas.',
          criterio: 'El cumplimiento en la entrega de órdenes debe ser del 100%.'
        },
        {
          pregunta: '¿La carga de trámites administrativos está balanceada entre los auxiliares para evitar cuellos de botella que afecten la experiencia del paciente?',
          prueba: 'Comparativa de volumen de pacientes: Aux. Castro (24) vs. Aux. Moreno (19). Evaluar si la menor productividad de Moreno justifica su mayor tiempo promedio de atención.',
          criterio: 'La variabilidad en la carga de trabajo no debe superar el 20% para asegurar la agilidad del servicio de cierre.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 6 - Sala de Quimioterapia',
      preguntas: [
        {
          pregunta: '¿Existen barreras logísticas o técnicas en la central de mezclas que impidan cumplir con el estándar de preparación de medicamentos oncológicos?',
          prueba: 'Análisis de la causa raíz de la alerta roja en el paso "Prep. Farmacia" (38 min promedio). Verificación de los tiempos de validación farmacéutica para el paciente P-Q003 (52 min en espera).',
          criterio: 'El tiempo de preparación en farmacia no debe exceder los 30 minutos.'
        },
        {
          pregunta: '¿Se garantiza que el flujo del paciente (Admisión → Laboratorios → Farmacia → Aplicación) se realice sin interrupciones que afecten la oportunidad del tratamiento?',
          prueba: 'Auditoría de los expedientes de los 8 pacientes del día para identificar en qué punto se rompe el cumplimiento de la ruta (actualmente al 85%).',
          criterio: 'El cumplimiento de la Ruta Cáncer debe ser ≥ 95%.'
        },
        {
          pregunta: '¿El tiempo de aplicación del tratamiento es coherente con el protocolo específico de cada esquema de quimioterapia para asegurar la seguridad del paciente?',
          prueba: 'Verificación del tiempo promedio de Aplicación (120 min) frente a las órdenes médicas. Validación de que el 100% de los pacientes en aplicación cuenten con supervisión de enfermería oncológica.',
          criterio: 'El tiempo de aplicación debe ajustarse estrictamente al protocolo clínico definido para cada paciente (4/8 pacientes están actualmente en esta fase).'
        },
        {
          pregunta: '¿Se cuenta con los resultados de laboratorios de control (ej. hemograma/neutrófilos) en el tiempo requerido para autorizar el inicio de la preparación del medicamento?',
          prueba: 'Medición del intervalo entre la llegada del paciente a admisión y el reporte de laboratorios (Promedio actual: 25 min).',
          criterio: 'Los laboratorios de soporte deben estar disponibles en un máximo de 30 minutos para no retrasar la cadena.'
        },
        {
          pregunta: '¿Cuál es el plan de contingencia y comunicación con el paciente cuando el sistema detecta una espera superior a 30 minutos en la fase de preparación?',
          prueba: 'Verificación de la nota de seguimiento para el paciente P-Q003. Determinar si la demora de 52 min se debe a falta de insumos, complejidad de la mezcla o falla en el transporte interno.',
          criterio: 'Toda alerta de "Excede 30 min" debe tener una justificación administrativa o clínica registrada.'
        }
      ]
    }
  ]
};