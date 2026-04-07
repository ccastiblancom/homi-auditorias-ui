export const flujoConsulta = {
  id: 'consulta',
  titulo: 'Auditoría de Consulta Externa',
  puntosControl: [
    {
      nombre: 'Punto de Control 1 - Agendamiento y Mallas', // [cite: 181]
      preguntas: [
        {
          pregunta: '¿Se cumple con el estándar de días de espera definido institucionalmente para la asignación de citas en especialidades críticas?', // [cite: 182]
          prueba: 'Comparativa entre la meta de días vs. la realidad reportada. Análisis específico de la brecha en Cardiología Pediátrica (12d / 7d) y Neurología (8d / 7d).', // [cite: 183, 184]
          criterio: 'Los días de espera no deben superar la meta establecida para cada especialidad (señalizada con alerta roja en el tablero).' // [cite: 185]
        },
        {
          pregunta: '¿Existen estrategias efectivas de confirmación de citas (llamadas, SMS, correos) para mitigar el impacto de las citas incumplidas en la capacidad instalada?', // [cite: 186]
          prueba: 'Análisis de paciente trazador con cita incumplida. Verificar si existe registro de contacto previo con el paciente 48-72 horas antes de la cita y si se realizó el proceso de reasignación de esos espacios.', // [cite: 187, 188]
          criterio: 'La tasa de inasistencia debe ser monitoreada y gestionada para no superar el 10% del total de la agenda.' // [cite: 189]
        },
        {
          pregunta: '¿Se clasifican y analizan las causas de las citas canceladas para identificar fallos imputables a la institución (ausencia del médico, fallas de infraestructura) vs. causas del paciente?', // [cite: 190]
          prueba: 'Revisión del log de cancelaciones del día. Verificar si las citas canceladas por el hospital fueron reprogramadas en menos de 5 días hábiles.', // [cite: 191, 192]
          criterio: 'El 100% de las citas canceladas por el prestador deben contar con un plan de reprogramación inmediata.' // [cite: 193]
        },
        {
          pregunta: '¿Se ajusta la oferta de la malla en servicios de alta demanda como Terapia Física para corregir desviaciones en la oportunidad?', // [cite: 194]
          prueba: 'Evaluación del indicador de Terapia Física (6d / 5d). Determinar si el exceso de demanda requiere una ampliación de la malla o una optimización de la rotación de consultorios.', // [cite: 195, 196]
          criterio: 'La oportunidad en servicios de apoyo terapéutico debe mantenerse alineada con la meta de 5 días.' // [cite: 197]
        },
        {
          pregunta: '¿La relación entre citas cumplidas (142) y la malla de especialistas disponible garantiza el uso óptimo de la infraestructura física del hospital?', // [cite: 198]
          prueba: 'Cálculo de la ocupación de la malla. Verificar si las especialidades con mejores tiempos de espera (Oncología 2d/3d) tienen capacidad de absorber demanda de otras áreas o si su malla está subutilizada.', // [cite: 199, 200]
          criterio: 'La ocupación global de la malla de consulta externa debe ser ≥ 85%.' // [cite: 201]
        }
      ]
    },
    {
      nombre: 'Punto de Control 2 - Admisión y Facturación', // [cite: 202]
      preguntas: [
        {
          pregunta: '¿Se garantiza que el tiempo de espera del paciente desde su llegada hasta ser atendido en ventanilla se mantenga dentro del estándar institucional para evitar aglomeraciones?', // [cite: 203]
          prueba: 'Contraste entre el ticket de llegada del paciente vs. la hora de inicio de atención en el módulo.', // [cite: 204]
          criterio: 'El tiempo de espera debe ser < 18 minutos.' // [cite: 205]
        },
        {
          pregunta: '¿Existen causas identificadas (fallas en sistema, trámites de alta complejidad o falta de documentos) que justifiquen que los tiempos máximos de atención lleguen o superen los 8 minutos?', // [cite: 206]
          prueba: 'Revisión de los casos atípicos en el Módulo M2 (Ramos P.), donde el tiempo máximo fue de 8 min, comparado con el promedio de 3 min.', // [cite: 207]
          criterio: 'El tiempo máximo de atención no debería exceder en más de un 50% al tiempo promedio del módulo.' // [cite: 208]
        },
        {
          pregunta: '¿Es equitativa la distribución de la carga de trabajo entre los módulos para asegurar un flujo constante de pacientes hacia los consultorios?', // [cite: 209]
          prueba: 'Comparativa de productividad: López M. (M1) atendió 45 pacientes con un promedio de 6 min, mientras Ramos P. (M2) atendió 38 pacientes con 8 min.', // [cite: 210]
          criterio: 'La variabilidad de productividad entre facturadores no debe superar el 20% para mantener la agilidad del servicio.' // [cite: 211]
        },
        {
          pregunta: '¿Se realiza la validación completa de derechos y la recaudación de copagos/cuotas moderadoras de acuerdo con la normativa vigente en cada turno de atención?', // [cite: 212]
          prueba: 'Auditoría aleatoria de los cierres de caja y soportes de autorización generados por los tres módulos (M1, M2, M3) frente al reporte de 91% de cumplimiento.', // [cite: 213]
          criterio: 'El cumplimiento de los requisitos de admisión y facturación debe ser ≥ 95% (actualmente hay una brecha del 4%).' // [cite: 214]
        },
        {
          pregunta: '¿El proceso de facturación se completa con la antelación suficiente para que el paciente esté disponible en sala de espera antes del llamado a la siguiente etapa; toma de signos o llamado del médico?', // [cite: 215, 216]
          prueba: 'Medición del intervalo entre el fin de la facturación y la hora programada de la cita.', // [cite: 217]
          criterio: 'El proceso de admisión y facturación debe finalizar al menos 5 minutos antes de la hora pactada de la cita médica.' // [cite: 218]
        }
      ]
    },
    {
      nombre: 'Punto de Control 3 - Toma de Signos (Pre-consulta)', // [cite: 219]
      preguntas: [
        {
          pregunta: '¿Se cumple con el estándar de tiempo de espera desde que el paciente finaliza su admisión hasta que es llamado para la toma de signos vitales?', // [cite: 220]
          prueba: 'Contraste entre la hora de finalización en el módulo de facturación vs. la hora de llamado en los módulos de Toma de Signos (TS). Análisis del promedio de 3.1 min frente a la meta establecida.', // [cite: 221, 222]
          criterio: 'El tiempo de espera para pre-consulta debe ser ≤ 5 minutos.' // [cite: 223]
        },
        {
          pregunta: '¿El tiempo dedicado a la toma de signos (tensión, peso, frecuencia, etc.) es suficiente para garantizar la precisión del dato sin generar retrasos en el inicio de la consulta médica?', // [cite: 224]
          prueba: 'Evaluación del Tiempo de Atención (4.2 min) frente a la meta de 5 min. Análisis de la variabilidad entre auxiliares (García: 3.8 min vs. Rodríguez: 4.5 min).', // [cite: 225, 226]
          criterio: 'El tiempo de atención promedio debe oscilar entre 3 y 5 minutos.' // [cite: 227]
        },
        {
          pregunta: '¿Existen factores identificados (pacientes con movilidad reducida, fallas en equipos biomédicos) que justifiquen tiempos máximos de hasta 10 minutos en la toma de signos?', // [cite: 228]
          prueba: 'Revisión de los registros de tiempo máximo en el Módulo TS-2 (Aux. Rodríguez). Verificar si el retraso impactó el cumplimiento de la hora de la cita médica subsiguiente.', // [cite: 229, 230]
          criterio: 'Los tiempos máximos no deben superar el doble del tiempo promedio de atención del módulo.' // [cite: 231]
        },
        {
          pregunta: '¿La carga de pacientes está distribuida de manera equitativa entre los auxiliares disponibles para evitar el agotamiento del personal y asegurar la agilidad del flujo?', // [cite: 232]
          prueba: 'Comparativa de volumen: Aux. Rodríguez atendió 32 pacientes, mientras que Aux. Díaz atendió 25.', // [cite: 233, 234]
          criterio: 'La diferencia de carga entre módulos no debe ser superior al 25% para mantener un flujo balanceado.' // [cite: 235]
        },
        {
          pregunta: '¿Se garantiza el registro de los signos vitales tomados para que el médico los visualice al momento del llamado del paciente?', // [cite: 236]
          prueba: 'Auditoría de registro manual o de historias clínicas.', // [cite: 237]
          criterio: 'El registro de signos vitales debe ser inmediato y completo en el 100% de los casos atendidos.' // [cite: 238]
        }
      ]
    },
    {
      nombre: 'Punto de Control 4 - Consulta y/o Procedimiento', // [cite: 239]
      preguntas: [
        {
          pregunta: '¿Se cumple con el estándar de puntualidad para el inicio de la consulta médica una vez que el paciente ha superado las etapas de facturación y pre-consulta?', // [cite: 240]
          prueba: 'Comparativa entre la hora programada de la cita vs. la hora real de llamado al consultorio. Análisis del promedio de 12 min frente a la meta de 10 min.', // [cite: 241, 242]
          criterio: 'El tiempo de espera para el inicio de la consulta debe ser ≤ 10 minutos.' // [cite: 243]
        },
        {
          pregunta: '¿El tiempo de duración de la consulta se ajusta a los estándares institucionales, permitiendo una evaluación clínica completa sin comprometer la puntualidad de la agenda?', // [cite: 244]
          prueba: 'Evaluación del Tiempo de Atención (20/25/30 min). Análisis de la variabilidad entre profesionales: Dr. Hernández (15 min) vs. Dra. Vargas (20 min).', // [cite: 245, 246]
          criterio: 'El tiempo promedio de atención debe ser coherente con el tipo de especialidad (rango esperado de acuerdo con estándar de especialidad).' // [cite: 247]
        },
        {
          pregunta: '¿Se documentan las causas por las cuales algunas consultas exceden significativamente el tiempo promedio, llegando a máximos de 35 minutos?', // [cite: 248]
          prueba: 'Revisión de las historias clínicas en el Consultorio C-02 (Dra. Vargas) para identificar si los tiempos máximos se deben a procedimientos en consultorio, pacientes de primera vez o educación compleja.', // [cite: 249]
          criterio: 'Los tiempos máximos no deben generar un retraso acumulado que supere los 20 minutos al final de la jornada.' // [cite: 250]
        },
        {
          pregunta: '¿Se asegura que al finalizar la consulta el paciente cuente con el 100% de sus órdenes médicas, fórmulas y citas de control debidamente cargadas en el sistema?', // [cite: 251]
          prueba: 'Verificación de egresos de consulta externa para validar la completitud del plan de manejo y la entrega de documentos al paciente.', // [cite: 252]
          criterio: 'El 100% de los pacientes deben salir del consultorio con su conducta clínica definida y documentada.' // [cite: 253]
        }
      ]
    },
    {
      nombre: 'Punto de Control 5 - Postconsulta (Gestión de Órdenes)', // [cite: 254]
      preguntas: [
        {
          pregunta: '¿Se garantiza que el tiempo de espera del paciente desde que sale del consultorio hasta que es atendido para la entrega de órdenes no supere los 10 minutos?', // [cite: 255]
          prueba: 'Cotejo entre la hora de cierre de la consulta médica vs. la hora de llamado en los módulos de Postconsulta (PC). Análisis del promedio de 5.4 min frente a la meta.', // [cite: 256, 257]
          criterio: 'El tiempo de espera en postconsulta debe ser ≤ 10 minutos.' // [cite: 258]
        },
        {
          pregunta: '¿El tiempo de atención por módulo permite realizar una explicación clara de la preparación para exámenes y el uso de medicamentos sin exceder la meta de 10 minutos?', // [cite: 259]
          prueba: 'Evaluación del Tiempo de Atención (8.3 min). Análisis de la variabilidad: Aux. Salazar (7 min) vs. Aux. Moreno (9 min).', // [cite: 260, 261]
          criterio: 'El tiempo de atención promedio debe ser ≤ 10 minutos.' // [cite: 262]
        },
        {
          pregunta: '¿Existen causas administrativas o técnicas (fallas de impresora, falta de sellos, órdenes no cargadas por el médico) que justifiquen tiempos máximos de hasta 18 minutos?', // [cite: 263]
          prueba: 'Análisis de los casos atípicos en el Módulo PC-2 (Aux. Moreno). Verificar si el retraso se debió a la complejidad de las órdenes o a problemas con el sistema de información.', // [cite: 264, 265]
          criterio: 'Los tiempos máximos no deben exceder el doble del promedio institucional.' // [cite: 266]
        },
        {
          pregunta: '¿Se asegura que el paciente reciba la totalidad de sus soportes clínicos y administrativos antes de abandonar la institución?', // [cite: 267]
          prueba: 'Auditoría de los soportes entregados frente al registro de 87% de cumplimiento. Identificar si la brecha del 13% corresponde a órdenes que quedaron en estado "borrador" o que no fueron impresas.', // [cite: 268, 269]
          criterio: 'El cumplimiento en la entrega de órdenes debe ser del 100%.' // [cite: 270]
        },
        {
          pregunta: '¿La carga de trámites administrativos está balanceada entre los auxiliares para evitar cuellos de botella que afecten la experiencia del paciente?', // [cite: 271]
          prueba: 'Comparativa de volumen de pacientes: Aux. Castro (24) vs. Aux. Moreno (19). Evaluar si la menor productividad de Moreno justifica su mayor tiempo promedio de atención.', // [cite: 272, 273]
          criterio: 'La variabilidad en la carga de trabajo no debe superar el 20% para asegurar la agilidad del servicio de cierre.' // [cite: 274]
        }
      ]
    },
    {
      nombre: 'Punto de Control 6 - Sala de Quimioterapia (aplica solo para pacientes oncológicos)', // [cite: 275]
      preguntas: [
        {
          pregunta: '¿Existen barreras logísticas o técnicas en la central de mezclas que impidan cumplir con el estándar de preparación de medicamentos oncológicos?', // [cite: 276]
          prueba: 'Análisis de la causa raíz de la alerta roja en el paso "Prep. Farmacia" (38 min promedio). Verificación de los tiempos de validación farmacéutica para el paciente P-Q003 (52 min en espera).', // [cite: 277, 278]
          criterio: 'El tiempo de preparación en farmacia no debe exceder los 30 minutos.' // [cite: 279]
        },
        {
          pregunta: '¿Se garantiza que el flujo del paciente (Admisión → Laboratorios → Farmacia → Aplicación) se realice sin interrupciones que afecten la oportunidad del tratamiento?', // [cite: 280]
          prueba: 'Auditoría de los expedientes de los 8 pacientes del día para identificar en qué punto se rompe el cumplimiento de la ruta (actualmente al 85%).', // [cite: 281]
          criterio: 'El cumplimiento de la Ruta Cáncer debe ser ≥ 95%.' // [cite: 282]
        },
        {
          pregunta: '¿El tiempo de aplicación del tratamiento es coherente con el protocolo específico de cada esquema de quimioterapia para asegurar la seguridad del paciente?', // [cite: 283]
          prueba: 'Verificación del tiempo promedio de Aplicación (120 min) frente a las órdenes médicas. Validación de que el 100% de los pacientes en aplicación cuenten con supervisión de enfermería oncológica.', // [cite: 284, 285]
          criterio: 'El tiempo de aplicación debe ajustarse estrictamente al protocolo clínico definido para cada paciente (4/8 pacientes están actualmente en esta fase).' // [cite: 286]
        },
        {
          pregunta: '¿Se cuenta con los resultados de laboratorios de control (ej. hemograma/neutrófilos) en el tiempo requerido para autorizar el inicio de la preparación del medicamento?', // [cite: 287]
          prueba: 'Medición del intervalo entre la llegada del paciente a admisión y el reporte de laboratorios (Promedio actual: 25 min).', // [cite: 288]
          criterio: 'Los laboratorios de soporte deben estar disponibles en un máximo de 30 minutos para no retrasar la cadena.' // [cite: 289]
        },
        {
          pregunta: '¿Cuál es el plan de contingencia y comunicación con el paciente cuando el sistema detecta una espera superior a 30 minutos en la fase de preparación?', // [cite: 290]
          prueba: 'Verificación de la nota de seguimiento para el paciente P-Q003. Determinar si la demora de 52 min se debe a falta de insumos, complejidad de la mezcla o falla en el transporte interno.', // [cite: 291, 292]
          criterio: 'Toda alerta de "Excede 30 min" debe tener una justificación administrativa o clínica registrada.' // [cite: 293]
        }
      ]
    },
    {
      nombre: 'Punto de Control 7 - Experiencia del Cliente en Consulta Externa', // [cite: 294, 295]
      preguntas: [
        {
          pregunta: '¿Las salas de espera cuentan con la capacidad instalada suficiente, silletería en buen estado, climatización e iluminación adecuada para garantizar el confort de los pacientes y sus acompañantes antes de la cita?', // [cite: 296]
          prueba: 'Observación directa de las salas de espera durante las horas pico de agendamiento y verificación del funcionamiento de los sistemas de ventilación o aire acondicionado.', // [cite: 297]
          criterio: 'El 100% de las salas de espera deben ofrecer un ambiente confortable, seguro y sin hacinamiento (silletería suficiente para el volumen de pacientes citados).' // [cite: 298]
        },
        {
          pregunta: '¿Se mantienen los consultorios, pasillos y baños públicos en óptimas condiciones de limpieza, orden y dotación de insumos básicos (jabón, toallas de papel) a lo largo de toda la jornada de atención?', // [cite: 299]
          prueba: 'Inspección física aleatoria de baños y áreas comunes, además de la revisión de las planillas de aseo concurrente firmadas por el personal de servicios generales.', // [cite: 300]
          criterio: 'Ausencia total de residuos fuera de los recipientes correspondientes y cumplimiento estricto del cronograma de desinfección y limpieza institucional.' // [cite: 301]
        },
        {
          pregunta: '¿El personal asistencial y administrativo (facturadores, auxiliares y médicos) se dirige al paciente por su nombre, mantiene una actitud empática y garantiza la privacidad visual y auditiva durante la atención?', // [cite: 302]
          prueba: 'Observación de la interacción paciente-personal (técnica de cliente incógnito) en los módulos de atención y verificación de que las puertas de los consultorios permanezcan cerradas durante la valoración médica.', // [cite: 303]
          criterio: 'El 100% de las interacciones observadas deben evidenciar un trato cordial, respetuoso y con garantía total de la privacidad del paciente.' // [cite: 304]
        },
        {
          pregunta: '¿Existen mecanismos efectivos (pantallas de llamado, personal orientador) para informar a los pacientes sobre sus turnos y manejar proactivamente las expectativas en caso de retrasos en las agendas de los especialistas?', // [cite: 305]
          prueba: 'Entrevista aleatoria a pacientes en sala de espera consultando si conocen el estado de su turno y si han sido notificados por el personal en caso de que el médico presente demoras en su agenda.', // [cite: 306]
          criterio: 'Los pacientes deben recibir información clara y proactiva frente a cualquier desviación o retraso superior a 15 minutos en su hora programada de atención.' // [cite: 307]
        },
        {
          pregunta: '¿Se cuenta con señalización clara, visible y de fácil comprensión que oriente al paciente en su flujo continuo a través de los diferentes puntos del servicio (Admisión → Toma de signos → Consultorio → Postconsulta)?', // [cite: 308]
          prueba: 'Recorrido simulando la ruta del paciente desde la entrada principal hasta la salida, verificando la legibilidad de los letreros y la disposición del personal para brindar indicaciones.', // [cite: 309]
          criterio: 'El 100% de la ruta de atención ambulatoria debe estar correctamente señalizada para evitar pérdida de tiempo y desplazamientos innecesarios del usuario.' // [cite: 310]
        }
      ]
    }
  ]
};