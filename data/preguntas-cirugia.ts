export const flujoCirugia = {
  id: 'cirugia',
  titulo: 'Auditoría de Salas de Cirugía',
  puntosControl: [
    {
      nombre: 'Punto de Control 1 - Programación Quirúrgica',
      preguntas: [
        {
          pregunta: '¿Se garantiza el cumplimiento del estándar de tiempo para el ingreso a salas de cirugía en pacientes procedentes de Urgencias, mitigando el riesgo de complicaciones por espera prolongada?',
          prueba: 'Comparativa entre la hora de solicitud de cirugía vs. la hora de ingreso real a salas. Análisis del cumplimiento del 82% frente a la meta institucional de 6 horas.',
          criterio: 'El tiempo de oportunidad para cirugía de urgencias debe ser < 6 horas.'
        },
        {
          pregunta: '¿Existen protocolos de verificación pre-quirúrgica que minimicen las cancelaciones por causas evitables (administrativas e infraestructura)?',
          prueba: 'Auditoría de los reportes de cancelación del día (ej. la cancelación por Infraestructura en Hospitalización y las 2 Administrativas en Ambulatoria). Verificar si el fallo fue por falta de equipos, falta de insumos o falta de autorizaciones de la EPS.',
          criterio: 'La tasa de cancelación por causas no clínicas (administrativas/infraestructura) debe tender a 0%.'
        },
        {
          pregunta: '¿Se optimiza el uso de la agenda quirúrgica para pacientes hospitalizados, evitando estancias prolongadas innecesarias por retrasos en la programación?',
          prueba: 'Revisión de la oportunidad de 36 horas actual frente a la meta de 48 horas. Verificar si el 12% de incumplimiento en programación se debe a falta de disponibilidad de cirujano o de sala.',
          criterio: 'El 100% de los pacientes hospitalizados con orden quirúrgica deben programarse en menos de 48 horas.'
        },
        {
          pregunta: '¿Se realiza una gestión activa de los pacientes cuyas cirugías fueron reprogramadas (actualmente 9 casos en total) para asegurar su atención en el menor tiempo posible?',
          prueba: 'Seguimiento al listado de las 3 reprogramaciones en Urgencias y las 4 en Ambulatoria. Identificar la recurrencia de pacientes que han sido reprogramados más de una vez.',
          criterio: 'Ningún paciente debe presentar más de 1 reprogramación por causas administrativas o de infraestructura.'
        },
        {
          pregunta: '¿El proceso de programación ambulatoria asegura la confirmación del paciente y los trámites administrativos con antelación suficiente para evitar la pérdida de turnos quirúrgicos?',
          prueba: 'Análisis de las cancelaciones en ambulatoria (1 Clínica, 2 Administrativas, 1 Paciente). Verificar si existió contacto previo de confirmación y validación de autorizaciones 48 horas antes.',
          criterio: 'El cumplimiento de la programación ambulatoria debe ser ≥ 95% (actualmente 91%).'
        }
      ]
    },
    {
      nombre: 'Punto de Control 2 - Procedimiento Quirúrgico',
      preguntas: [
        {
          pregunta: '¿Se cumple de manera sistemática con el protocolo de "Time-out" y la doble verificación de identidad, sitio quirúrgico y procedimiento antes de la incisión?',
          prueba: 'Revisión de la lista de chequeo de cirugía segura en la historia clínica. Análisis del margen de error del 0.8% (dado el 99.2% actual) para identificar si hubo incidentes o cuasi-fallas.',
          criterio: 'El cumplimiento de la identificación correcta debe ser del 100%.'
        },
        {
          pregunta: '¿Existen demoras no justificadas en la rotación de pacientes entre cirugías que afecten la productividad del bloque quirúrgico?',
          prueba: 'Medición del tiempo transcurrido desde la salida del paciente anterior hasta el ingreso del siguiente. El tablero muestra 28 min (excede la meta de 20 min).',
          criterio: 'El tiempo de recambio promedio debe ser ≤ 20 minutos.'
        },
        {
          pregunta: '¿La inducción anestésica se realiza de forma oportuna para asegurar que el inicio de la cirugía coincida con la programación de la agenda?',
          prueba: 'Evaluación del Cumplimiento Anestesia (93%). Identificar si el 7% de incumplimiento responde a evaluaciones pre-anestésicas tardías o falta de disponibilidad del especialista en sala.',
          criterio: 'La puntualidad del acto anestésico debe ser ≥ 95%.'
        },
        {
          pregunta: '¿La variabilidad entre el tiempo quirúrgico estimado y el real se mantiene dentro de márgenes que no desprogramen las cirugías subsiguientes?',
          prueba: 'Comparativa en la consola. Caso García L., M. (Sala 1): Estimado 45 min vs. Real 52 min (+7 min). Caso Torres D., C. (Sala 4): 180 min vs. 175 min (Eficiente).',
          criterio: 'La desviación entre el tiempo estimado y el real no debe superar el 15% de la duración total del procedimiento.'
        },
        {
          pregunta: '¿El tiempo de respuesta del servicio de aseo especializado permite la disponibilidad inmediata de la sala tras finalizar un procedimiento?',
          prueba: 'Análisis del tiempo de Limpieza (18 min) frente a la meta de 15 min. Verificar si el estado de "Preparación" en la Sala 3 (Martínez S., L.) se debe a demoras en la higienización.',
          criterio: 'El tiempo de limpieza concurrente en salas debe ser ≤ 15 minutos.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 3 - Postquirúrgico y Recuperación',
      preguntas: [
        {
          pregunta: '¿Se activó el protocolo de reporte y análisis de causa raíz ante la ocurrencia de complicaciones inmediatas y eventos adversos en el área de recuperación?',
          prueba: 'Revisión del registro de eventos adversos para el paciente Martínez S., L. y análisis de la gestión realizada. Verificación de si las 2 complicaciones inmediatas fueron notificadas al programa de Seguridad del Paciente.',
          criterio: 'Reporte del 100% de los eventos adversos y complicaciones en menos de 24 horas.'
        },
        {
          pregunta: '¿Se garantiza que todo paciente que egresa de salas de cirugía cuente con su nota perioperatoria y checklist de recuperación completo para asegurar la continuidad del cuidado?',
          prueba: 'Análisis de los casos de Rodríguez P., A. y Martínez S., L., quienes presentan fallas en el registro de la Nota Perioperatoria y el Checklist (Completitud actual: 94%).',
          criterio: 'El cumplimiento de la completitud del Checklist y Nota Perioperatoria debe ser del 100%.'
        },
        {
          pregunta: '¿Se aplican las escalas de valoración (ej. Aldrete o Bromage) de manera estricta para determinar el destino seguro del paciente (UCI, Hospitalización o Ambulatorio)?',
          prueba: 'Verificación en la HC del paciente Martínez S., L. de los criterios clínicos que justificaron su traslado a la UCI tras el evento adverso.',
          criterio: 'Todo traslado a una unidad de mayor complejidad desde recuperación debe estar soportado por una nota médica que justifique el cambio de destino.'
        },
        {
          pregunta: '¿El tiempo de permanencia en la unidad de recuperación es coherente con el estado clínico del paciente, evitando estancias prolongadas que bloqueen la salida de quirófanos?',
          prueba: 'Medición del tiempo de recuperación promedio (1.8h) frente a la meta de 2h. Identificar si pacientes estables permanecen en el área por falta de cama en piso.',
          criterio: 'El tiempo promedio de recuperación debe ser ≤ 2 horas.'
        },
        {
          pregunta: '¿Se realiza la programación de la cita de control postquirúrgico antes del egreso del paciente para garantizar el seguimiento ambulatorio y detectar complicaciones tardías?',
          prueba: 'Verificación en la consola de la asignación de fechas para los pacientes ambulatorios y hospitalizados. Caso crítico: Martínez S., L., quien figura con cita "Pendiente" debido a su estado crítico.',
          criterio: 'El 100% de los pacientes con destino ambulatorio u hospitalario deben tener su cita de control programada (Criterio: meta de fecha asignada).'
        }
      ]
    }
  ]
};