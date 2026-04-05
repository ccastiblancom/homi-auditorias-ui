export const flujoHospitalizacion = {
  id: 'hospitalizacion',
  titulo: 'Auditoría de Hospitalización',
  puntosControl: [
    {
      nombre: 'Punto de Control 1 - Presalidas (Gestión Anticipada)',
      preguntas: [
        {
          pregunta: '¿Se cumple con la ejecución de las presalidas programadas para el día, asegurando que el paciente cuente con la orden de egreso antes del mediodía?',
          prueba: 'Cotejo entre el listado de las 18 presalidas programadas vs. las 12 ejecutadas. Identificación de los 6 casos fallidos y su hora de registro final.',
          criterio: 'La efectividad de ejecución debe ser ≥ 80% (actualmente 67%).'
        },
        {
          pregunta: '¿Existe un protocolo de solicitud anticipada de oxígeno (mínimo 24 horas antes) que prevenga el retraso en el egreso del paciente?',
          prueba: 'Revisión de los registros de solicitud de oxígeno para los casos que representan el 35% del incumplimiento. Verificar si la demora es de la aseguradora, el proveedor o por solicitud tardía del hospital.',
          criterio: 'El 100% de los pacientes con requerimiento de oxígeno deben tener el equipo gestionado y confirmado previo al día del egreso.'
        },
        {
          pregunta: '¿Los trámites de egreso administrativo (autorizaciones de salida, transporte, copagos) se inician de forma concurrente con la evolución médica?',
          prueba: 'Auditoría de los tiempos de respuesta de la oficina de admisiones/facturación para el 25% de los casos de incumplimiento bajo la causa "Trámites PHD".',
          criterio: 'El trámite administrativo no debe exceder las 2 horas tras la firma de la orden médica de presalida.'
        },
        {
          pregunta: '¿Se garantizó la realización de laboratorios, curaciones o procedimientos finales antes de la hora programada de la presalida?',
          prueba: 'Revisión de la causa de incumplimiento del 20% (Pendientes clínicos). Verificar si hubo retraso en la ronda médica o en la ejecución de servicios de apoyo.',
          criterio: 'El 100% de los pendientes clínicos deben estar resueltos al menos 2 horas antes de la hora proyectada de salida.'
        },
        {
          pregunta: '¿Se cuenta con un trabajador social o gestor de casos que gestione oportunamente el cupo en albergues o transporte especial para pacientes vulnerables?',
          prueba: 'Verificación del tiempo de gestión para el 12% de incumplimientos por "Albergue no disponible". Análisis de la comunicación con las entidades de apoyo externo.',
          criterio: 'La gestión de soporte social debe iniciarse al menos 48 horas antes del egreso proyectado para evitar bloqueos de cama innecesarios.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 2 - Egresos (Eficiencia en el Cierre)',
      preguntas: [
        {
          pregunta: '¿Se garantiza que el médico tratante realice la ronda y registre el egreso en el sistema antes de las 10:00 AM para activar la cadena logística?',
          prueba: 'Análisis de la columna "Médico" en la consola de egresos. Caso crítico: Torres D., C. (10:45 AM) y Martínez S., L. (Pendiente).',
          criterio: 'El 80% de los clics de egreso médico deben ocurrir antes de las 10:00 AM.'
        },
        {
          pregunta: '¿Existe un flujo ágil entre enfermería y farmacia para el cierre de la cuenta de medicamentos una vez se ordena el egreso?',
          prueba: 'Medición del tiempo entre el clic médico y la validación de farmacia. El promedio actual de 18 min indica un retraso frente a la meta de 10 min.',
          criterio: 'El tiempo de devolución de medicamentos no debe superar los 10 minutos.'
        },
        {
          pregunta: '¿Se realizan las actividades de cierre clínico (curaciones, retiro de accesos) y el cierre de facturación de forma concurrente para evitar estancias innecesarias?',
          prueba: 'Comparativa de tiempos en la consola. Caso García López, M., cuya facturación se realizó solo 10 minutos después de enfermería (Eficiente), vs. el promedio general de 25 min en facturación.',
          criterio: 'El tiempo de facturación debe ser ≤ 15 minutos.'
        },
        {
          pregunta: '¿La notificación de "Cama Desocupada" se realiza inmediatamente después de la salida física del paciente o existen demoras administrativas en el reporte?',
          prueba: 'Análisis del Clic de Liberación. El tablero muestra un promedio de 35 min (excede la meta de 20 min). Verificar por qué el paciente Vargas R., J. sigue pendiente de liberación si facturó a las 08:30.',
          criterio: 'El tiempo entre facturación y liberación debe ser ≤ 20 minutos.'
        },
        {
          pregunta: '¿El personal de servicios generales responde oportunamente al llamado de limpieza para garantizar el "Giro-Cama" necesario para los pacientes de Urgencias?',
          prueba: 'Revisión del tiempo de Limpieza Promedio (42 min). Identificación de cuellos de botella en la asignación de personal de aseo o falta de kits de limpieza.',
          criterio: 'El tiempo de limpieza terminal debe ser ≤ 30 minutos.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 3 - Estancias por Diagnóstico',
      preguntas: [
        {
          pregunta: '¿Existen protocolos clínicos de manejo estandarizados que justifiquen las desviaciones superiores a 1 día en diagnósticos de alta complejidad (Fractura de fémur e ICC)?',
          prueba: 'Comparativa entre la guía de práctica clínica institucional vs. el registro de actividades en la HC para los pacientes con Fractura de fémur (8.4d). Identificar si la demora es por tiempo quirúrgico o por recuperación postoperatoria.',
          criterio: 'La desviación acumulada no debe superar la meta institucional de 4.2 días de estancia promedio.'
        },
        {
          pregunta: '¿El diagnóstico registrado al ingreso coincide con el diagnóstico de egreso y los procedimientos realizados durante la hospitalización?',
          prueba: 'Auditoría de calidad de registros para validar la Concordancia DX (88%). Analizar por qué existe un 2% de brecha para alcanzar la meta del 90%.',
          criterio: 'La concordancia diagnóstica debe ser ≥ 90% para garantizar un análisis GRD confiable.'
        },
        {
          pregunta: '¿Se están cumpliendo los hitos terapéuticos diarios en pacientes con Insuficiencia Cardíaca Congestiva (ICC) para evitar la estancia prolongada de 6,8 días?',
          prueba: 'Revisión del plan de manejo diario para casos de ICC. Verificar si la desviación de +1.3d se debe a descompensaciones evitables, demora en interconsultas o falta de ajuste de medicación.',
          criterio: 'La estancia para ICC debe tender a la meta esperada de 5.5 días.'
        },
        {
          pregunta: '¿El manejo de patologías de baja complejidad (Apendicitis y Bronquiolitis) se mantiene dentro del rango de eficiencia para liberar camas rápidamente?',
          prueba: 'Análisis de los tiempos de respuesta en casos de Apendicitis (3.1d). Validar si el +0.1d de desviación es marginal o si puede optimizarse mediante procesos de cirugía ambulatoria.',
          criterio: 'Los diagnósticos de baja complejidad no deben presentar desviaciones superiores a 0.2 días respecto a la meta esperada.'
        },
        {
          pregunta: '¿La variabilidad observada en Neumonía (+0,7d) responde a factores de comorbilidad del paciente o a ineficiencias en el reporte de paraclínicos y/o inicio de tratamiento antibiótico?',
          prueba: 'Revisión de la oportunidad del inicio de tratamiento en casos de Neumonía (J18). Evaluar si la estancia real de 5.2 días podría reducirse a los 4.5 días esperados mediante un protocolo de "Switch" temprano a vía oral.',
          criterio: 'Reducción de la variabilidad clínica no justificada en el 100% de los casos de complejidad media.'
        }
      ]
    }
  ]
};