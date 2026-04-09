export const flujoHospitalizacion = {
  id: 'hospitalizacion',
  titulo: 'Auditoría de Hospitalización', // 
  puntosControl: [
    {
      nombre: 'Punto de Control 1 - Presalidas (Gestión Anticipada)', // [cite: 118]
      preguntas: [
        {
          pregunta: '¿Se garantiza el cumplimiento de las presalidas programadas, asegurando la emisión oportuna de la orden médica de egreso antes del mediodía, como habilitador del flujo de salida?', // [cite: 119]
          prueba: 'Cotejo entre el listado de las 18 presalidas programadas vs. las 12 ejecutadas. Identificación de los 6 casos fallidos y su hora de registro final.', // [cite: 120, 121]
          criterio: 'La efectividad de ejecución debe ser ≥ 80%.' // [cite: 122]
        },
        {
          pregunta: '¿Existe un protocolo de solicitud anticipada de oxígeno (mínimo 24 horas antes) que prevenga el retraso en el egreso del paciente?', // [cite: 123]
          prueba: 'Revisión de los registros de solicitud de oxígeno para paciente trazador. Verificar si la demora es de la aseguradora, el proveedor o por solicitud tardía del hospital.', // [cite: 124, 125]
          criterio: 'El 100% de los pacientes con requerimiento de oxígeno deben tener el equipo gestionado y confirmado previo al día del egreso.' // [cite: 126]
        },
        {
          pregunta: '¿Los trámites de egreso administrativo (autorizaciones de salida, transporte, copagos) se inician de forma concurrente con la evolución médica?', // [cite: 127]
          prueba: 'Auditoría de los tiempos de respuesta de la oficina de admisiones/facturación para el paciente trazador la causa "Trámites PHD".', // [cite: 128]
          criterio: 'El trámite administrativo no debe exceder las 2 horas tras la firma de la orden médica de presalida.' // [cite: 129]
        },
        {
          pregunta: '¿Se garantiza el cierre oportuno de pendientes clínicos (laboratorios, procedimientos, curaciones) previo a la hora proyectada de egreso?', // [cite: 130]
          prueba: 'Revisión de la causa de incumplimiento del paciente trazador. Verificar si hubo retraso en la ronda médica o en la ejecución de servicios de apoyo.', // [cite: 131, 132]
          criterio: 'El 100% de los pendientes clínicos deben estar resueltos al menos 2 horas antes de la hora proyectada de salida.' // [cite: 133]
        },
        {
          pregunta: '¿Se cuenta con un trabajador social o gestor de casos que gestione oportunamente el cupo en albergues o transporte especial para pacientes vulnerables?', // [cite: 134]
          prueba: 'Verificación del tiempo de gestión para el paciente trazador (si aplica). Análisis de la comunicación con las entidades de apoyo externo.', // [cite: 135, 136]
          criterio: 'La gestión de soporte social debe iniciarse al menos 48 horas antes del egreso proyectado para evitar bloqueos de cama innecesarios.' // [cite: 137]
        }
      ]
    },
    {
      nombre: 'Punto de Control 2 - Egresos (Eficiencia en el Cierre)', // [cite: 138]
      preguntas: [
        {
          pregunta: '¿El equipo médico asegura la ejecución oportuna de la ronda y el registro de egreso antes de las 10:00 AM, como punto de activación del proceso logístico?', // [cite: 139]
          prueba: 'Verificación de registro clic de alta médica antes de las 10 am, en la consola de egresos. Caso crítico: Torres D., C. (10:45 AM) y Martínez S., L. (Pendiente).', // [cite: 140, 141]
          criterio: 'El clic de alta médico deben ocurrir antes de las 10:00 AM.' // [cite: 142]
        },
        {
          pregunta: '¿Existe sincronización operativa entre enfermería y farmacia para la devolución oportuna de medicamentos después de la definición de la presalida y posterior confirmación de salida con clic de la alta médico?', // [cite: 143]
          prueba: 'Medición del tiempo entre el clic médico y la validación de farmacia.', // [cite: 144]
          criterio: 'El tiempo de devolución de medicamentos no debe superar los 20 minutos.' // [cite: 145]
        },
        {
          pregunta: '¿La notificación de "Cama libre" se realiza inmediatamente después de la salida física del paciente o existen demoras administrativas en el reporte?', // [cite: 146]
          prueba: 'Análisis del Clic de Liberación. El tablero muestra un promedio de 35 min (excede la meta de 20 min). Verificar por qué el paciente Vargas R., J. sigue pendiente de liberación si facturó a las 08:30.', // [cite: 147, 148, 149]
          criterio: 'El tiempo entre facturación y liberación debe ser ≤ 20 minutos.' // [cite: 150]
        },
        {
          pregunta: '¿El personal de servicios generales responde oportunamente al llamado de limpieza para garantizar el "Giro-Cama" necesario para los pacientes de Urgencias?', // [cite: 151]
          prueba: 'Revisión del tiempo de Limpieza Promedio (42 min). Identificación de cuellos de botella en la asignación de personal de aseo o falta de kits de limpieza.', // [cite: 152, 153]
          criterio: 'El tiempo de limpieza terminal debe ser ≤ 40 – 60 minutos.' // [cite: 154]
        }
      ]
    },
    {
      nombre: 'Punto de Control 3 - Estancias por Diagnóstico', // [cite: 155]
      preguntas: [
        {
          pregunta: '¿Las desviaciones en la estancia hospitalaria para diagnósticos de alta complejidad se encuentran clínicamente justificadas y alineadas a guías institucionales?', // [cite: 156]
          prueba: 'Comparativa entre la guía de práctica clínica institucional vs. el registro de actividades en la HC para los pacientes con Fractura de fémur (8.4d). Identificar si la demora es por tiempo quirúrgico o por recuperación postoperatoria.', // [cite: 157, 158]
          criterio: 'La desviación acumulada no debe superar la meta institucional de acuerdo con el diagnóstico evaluado y su estancia promedio.' // [cite: 159]
        },
        {
          pregunta: '¿El diagnóstico registrado al ingreso coincide con el diagnóstico de egreso y los procedimientos realizados durante la hospitalización?', // [cite: 160]
          prueba: 'Auditoría de calidad de registros para validar la Concordancia DX (88%). Analizar por qué existe un 2% de brecha para alcanzar la meta del 90%.', // [cite: 161, 162]
          criterio: 'La concordancia diagnóstica debe ser ≥ 90% para garantizar un análisis GRD confiable.' // [cite: 163]
        }
      ]
    },
    {
      nombre: 'Punto de Control 4 - Experiencia del Cliente en Hospitalización', // [cite: 164]
      preguntas: [
        {
          pregunta: '¿Las habitaciones de hospitalización, camas, timbres de llamado, iluminación y mobiliario garantizan un entorno seguro y confortable para el paciente y su acompañante?', // [cite: 165]
          prueba: 'Inspección física aleatoria de las habitaciones para verificar el funcionamiento de los timbres de llamado a enfermería, el estado de las camas mecánicas/eléctricas y la comodidad del sillón del acompañante.', // [cite: 166]
          criterio: 'El 100% de las habitaciones evaluadas deben tener sus elementos de confort, comunicación e infraestructura totalmente operativos y sin daños.' // [cite: 167]
        },
        {
          pregunta: '¿Se evidencia un adecuado nivel de aseo, desinfección y orden en las habitaciones, baños y pasillos del piso de hospitalización, acorde a los protocolos institucionales de limpieza concurrente?', // [cite: 168]
          prueba: 'Observación directa de los baños de los pacientes (dotación de papel, jabón y limpieza de duchas) y revisión de los registros de limpieza diaria firmados por servicios generales.', // [cite: 169]
          criterio: 'Ausencia total de suciedad visible, malos olores o acumulación de ropa sucia y residuos hospitalarios en áreas de permanencia y tránsito.' // [cite: 170]
        },
        {
          pregunta: '¿El personal médico y de enfermería aplica protocolos de trato humanizado, llamando al paciente por su nombre, explicando los procedimientos y validando su nivel de dolor antes de cada intervención?', // [cite: 171]
          prueba: 'Entrevista directa y empática a pacientes hospitalizados (con más de 24 horas de estancia) y a sus acompañantes sobre su percepción del trato recibido y la claridad de la información médica brindada.', // [cite: 172]
          criterio: 'El 100% de los pacientes entrevistados deben reportar un trato respetuoso, humanizado y sentirse informados sobre su plan de cuidado diario.' // [cite: 173]
        },
        {
          pregunta: '¿Se fomenta una cultura institucional de control del ruido y respeto por el silencio en los pasillos de hospitalización, especialmente durante la noche y en los cambios de turno?', // [cite: 174]
          prueba: 'Observación del comportamiento del personal en las estaciones de enfermería y consulta al paciente sobre la calidad de su descanso y si fue interrumpido por ruidos administrativos o de pasillo.', // [cite: 175]
          criterio: 'Percepción positiva del paciente frente al ambiente de tranquilidad, garantizando las condiciones ideales para su recuperación y descanso.' // [cite: 176]
        },
        {
          pregunta: '¿El servicio de alimentación cumple con los estándares de oportunidad, presentación, temperatura y correspondencia exacta con la dieta prescrita por el médico o nutricionista?', // [cite: 177]
          prueba: 'Verificación en tiempo real durante la entrega de bandejas de comida: cruce de la dieta entregada vs. el kárdex médico, y evaluación de la satisfacción del paciente con la temperatura y presentación de los alimentos.', // [cite: 178]
          criterio: 'El 100% de las dietas entregadas deben ser clínicamente correctas y el servicio debe mantener los estándares de inocuidad y satisfacción del paciente.' // [cite: 179]
        }
      ]
    }
  ]
};
// --- INYECCIÓN AUTOMÁTICA DE PACIENTE TRAZADOR HOSPITALIZACIÓN ---
const preguntasTrazadorHospitalizacion: any[] = [];

for (let i = 0; i <= 2; i++) {
  if (flujoHospitalizacion.puntosControl[i]) {
    const nombrePunto = flujoHospitalizacion.puntosControl[i].nombre;
    const preguntasConEtiqueta = flujoHospitalizacion.puntosControl[i].preguntas.map((p: any) => ({
      ...p,
      pregunta: `[${nombrePunto}] ${p.pregunta}`
    }));
    preguntasTrazadorHospitalizacion.push(...preguntasConEtiqueta);
  }
}

flujoHospitalizacion.puntosControl.push({
  nombre: "Paciente trazador Hospitalización",
  preguntas: preguntasTrazadorHospitalizacion
});