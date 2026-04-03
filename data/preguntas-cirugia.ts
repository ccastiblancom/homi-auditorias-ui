export const flujoCirugia = {
    titulo: "SALAS DE CIRUGÍA",
    puntosControl: [
      {
        nombre: "1. Programación Quirúrgica",
        preguntas: [
          {
            id: "C-1-1",
            pregunta: "¿Se garantiza el cumplimiento del estándar de tiempo para el ingreso a salas de cirugía en pacientes procedentes de Urgencias, mitigando el riesgo de complicaciones por espera prolongada?",
            prueba: "Comparativa entre la hora de solicitud de cirugía vs. la hora de ingreso real a salas. Análisis del cumplimiento del 82% frente a la meta institucional de 6 horas.",
            criterio: "El tiempo de oportunidad para cirugía de urgencias debe ser < 6 horas."
          },
          {
            id: "C-1-2",
            pregunta: "¿Existen protocolos de verificación pre-quirúrgica que minimicen las cancelaciones por causas evitables (administrativas e infraestructura)?",
            prueba: "Auditoría de los reportes de cancelación del día. Verificar si el fallo fue por falta de equipos, insumos o autorizaciones.",
            criterio: "La tasa de cancelación por causas no clínicas debe tender a 0%."
          },
          {
            id: "C-1-3",
            pregunta: "¿Se optimiza el uso de la agenda quirúrgica para pacientes hospitalizados, evitando estancias prolongadas innecesarias por retrasos en la programación?",
            prueba: "Revisión de la oportunidad de 36 horas actual frente a la meta de 48 horas. Verificar si el 12% de incumplimiento se debe a falta de cirujano o sala.",
            criterio: "El 100% de los pacientes hospitalizados con orden quirúrgica deben programarse en menos de 48 horas."
          },
          {
            id: "C-1-4",
            pregunta: "¿Se realiza una gestión activa de los pacientes cuyas cirugías fueron reprogramadas para asegurar su atención en el menor tiempo posible?",
            prueba: "Seguimiento al listado de las 3 reprogramaciones en Urgencias y 4 en Ambulatoria. Identificar recurrencia.",
            criterio: "Ningún paciente debe presentar más de 1 reprogramación por causas administrativas o de infraestructura."
          },
          {
            id: "C-1-5",
            pregunta: "¿El proceso de programación ambulatoria asegura la confirmación del paciente y los trámites administrativos con antelación suficiente?",
            prueba: "Análisis de cancelaciones en ambulatoria. Verificar si existió contacto de confirmación 48 horas antes.",
            criterio: "El cumplimiento de la programación ambulatoria debe ser ≥ 95%."
          }
        ]
      },
      {
        nombre: "2. Procedimiento Quirúrgico",
        preguntas: [
          {
            id: "C-2-1",
            pregunta: "¿Se cumple de manera sistemática con el protocolo de 'Time-out' y la doble verificación de identidad, sitio quirúrgico y procedimiento antes de la incisión?",
            prueba: "Revisión de la lista de chequeo de cirugía segura en la historia clínica. Análisis del margen de error del 0.8%.",
            criterio: "El cumplimiento de la identificación correcta debe ser del 100%."
          },
          {
            id: "C-2-2",
            pregunta: "¿Existen demoras no justificadas en la rotación de pacientes entre cirugías que afecten la productividad del bloque quirúrgico?",
            prueba: "Medición del tiempo transcurrido desde la salida del paciente anterior hasta el ingreso del siguiente (Tablero muestra 28 min).",
            criterio: "El tiempo de recambio promedio debe ser ≤ 20 minutos."
          },
          {
            id: "C-2-3",
            pregunta: "¿La inducción anestésica se realiza de forma oportuna para asegurar que el inicio de la cirugía coincida con la programación de la agenda?",
            prueba: "Evaluación del Cumplimiento Anestesia (93%). Identificar si el 7% de incumplimiento responde a evaluaciones tardías.",
            criterio: "La puntualidad del acto anestésico debe ser ≥ 95%."
          },
          {
            id: "C-2-4",
            pregunta: "¿La variabilidad entre el tiempo quirúrgico estimado y el real se mantiene dentro de márgenes que no desprogramen las cirugías subsiguientes?",
            prueba: "Comparativa en la consola entre tiempo estimado vs real.",
            criterio: "La desviación entre el tiempo estimado y el real no debe superar el 15% de la duración total del procedimiento."
          },
          {
            id: "C-2-5",
            pregunta: "¿El tiempo de respuesta del servicio de aseo especializado permite la disponibilidad inmediata de la sala tras finalizar un procedimiento?",
            prueba: "Análisis del tiempo de Limpieza (18 min) frente a la meta de 15 min.",
            criterio: "El tiempo de limpieza concurrente en salas debe ser ≤ 15 minutos."
          }
        ]
      },
      {
        nombre: "3. Postquirúrgico y Recuperación",
        preguntas: [
          {
            id: "C-3-1",
            pregunta: "¿Se activó el protocolo de reporte y análisis de causa raíz ante la ocurrencia de complicaciones inmediatas y eventos adversos en el área de recuperación?",
            prueba: "Revisión del registro de eventos adversos y verificación de si las complicaciones fueron notificadas al programa de Seguridad del Paciente.",
            criterio: "Reporte del 100% de los eventos adversos y complicaciones en menos de 24 horas."
          },
          {
            id: "C-3-2",
            pregunta: "¿Se garantiza que todo paciente que egresa de salas de cirugía cuente con su nota perioperatoria y checklist de recuperación completo?",
            prueba: "Análisis de la completitud de la Nota Perioperatoria y el Checklist.",
            criterio: "El cumplimiento de la completitud del Checklist y Nota Perioperatoria debe ser del 100%."
          },
          {
            id: "C-3-3",
            pregunta: "¿Se aplican las escalas de valoración (ej. Aldrete o Bromage) de manera estricta para determinar el destino seguro del paciente?",
            prueba: "Verificación en la HC de los criterios clínicos que justificaron traslados a mayor complejidad.",
            criterio: "Todo traslado a una unidad de mayor complejidad debe estar soportado por una nota médica que justifique el cambio."
          },
          {
            id: "C-3-4",
            pregunta: "¿El tiempo de permanencia en la unidad de recuperación es coherente con el estado clínico del paciente, evitando estancias prolongadas?",
            prueba: "Medición del tiempo de recuperación promedio (1.8h) frente a la meta de 2h. Identificar pacientes estables sin cama en piso.",
            criterio: "El tiempo promedio de recuperación debe ser ≤ 2 horas."
          },
          {
            id: "C-3-5",
            pregunta: "¿Se realiza la programación de la cita de control postquirúrgico antes del egreso del paciente para garantizar el seguimiento ambulatorio?",
            prueba: "Verificación en la consola de la asignación de fechas para los pacientes ambulatorios y hospitalizados.",
            criterio: "El 100% de los pacientes con destino ambulatorio u hospitalario deben tener su cita de control programada."
          }
        ]
      }
    ]
  };