export const flujoUrgencias = {
  id: 'urgencias',
  titulo: 'Auditoría de Urgencias',
  puntosControl: [
    {
      nombre: 'Punto de Control 1 – Admisión y Triage',
      preguntas: [
        {
          pregunta: '¿Cumple el flujo con el intervalo de tiempo establecido desde el ingreso del paciente a la sala hasta su llamado efectivo por admisiones?',
          prueba: 'Cotejo del reporte de hora de llegada física vs. el Tiempo de registro de creación del registro en el Sistema de Información Hospitalaria (HIS).',
          criterio: 'El tiempo de espera en admisión debe ser < 5 minutos.'
        },
        {
          pregunta: '¿Se realiza la toma completa de signos vitales como paso obligatorio previo a la asignación definitiva del nivel de Triage?',
          prueba: 'Revisión historia clínica para validar el registro de tensión, frecuencia cardiaca y saturación. Análisis de desviaciones en casos donde la pertinencia es inferior al 95%.',
          criterio: 'La clasificación debe estar respaldada al 100% por hallazgos clínicos objetivos para evitar la subcategorización.'
        },
        {
          pregunta: '¿Se evidencia el cumplimiento del protocolo de información al paciente sobre su nivel de prioridad (I al V) y el significado de dicha clasificación?',
          prueba: 'Registro del nivel de prioridad de triage en el Sistema de Información Hospitalaria (HIS).',
          criterio: 'El 100% de los pacientes deben tener registro de haber sido informados sobre su nivel de prioridad.'
        },
        {
          pregunta: '¿Se garantiza que los pacientes clasificados en Nivel triage 2/triage 3 reciban información sobre los tiempos de espera estimados y las pautas de alarma ante el deterioro de síntomas?',
          prueba: 'Verificación en la historia clínica de la presencia de recomendaciones dadas y revisión de la activación de alertas visuales en el tablero para este grupo.',
          criterio: 'Cumplimiento de meta de atención < 30 min para el volumen de pacientes en Nivel 2/ meta de atención <80 min para el volumen de pacientes en triage 3.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 2 – Consulta y Capacidad Instalada',
      preguntas: [
        {
          pregunta: '¿Se cumple con el estándar de tiempo de espera para el inicio de la consulta médica según la prioridad asignada en el Triage?',
          prueba: 'Comparativa entre la marca de tiempo de cierre del Triage y la hora de apertura de la atención por el especialista en el sistema (HC).',
          criterio: 'El inicio de la consulta para Triage II debe ser < 30 min y para Triage III < 80 min.'
        },
        {
          pregunta: '¿Es el tiempo de ejecución de la consulta coherente con los estándares de agilidad y enfoque clínico institucional?',
          prueba: 'Análisis sistemático de los tiempos registrados entre la apertura y el cierre de historia clínica en plataforma digital.',
          criterio: 'El tiempo promedio de consulta por paciente debe ser < 25 minutos.'
        },
        {
          pregunta: '¿Existe una justificación clínica o operativa documentada para las desviaciones de tiempo que superan el margen de tolerancia institucional?',
          prueba: 'Análisis de la "Malla de Especialistas". Revisión de la causa raíz en casos específicos con desviaciones significativas (ej. Dra. Torres +12 min) mediante el log de actividades del consultorio.',
          criterio: 'La desviación por médico no debe exceder el 10% del tiempo promedio de consulta (aprox. +/- 2 min).'
        },
        {
          pregunta: '¿Los estados de "Pausa" registrados por el personal médico se encuentran debidamente autorizados y no afectan la cobertura de especialidades con pacientes en espera?',
          prueba: 'Verificación en el tablero de control de la duración y frecuencia de las pausas vs. la demanda de pacientes en sala de espera en ese momento.',
          criterio: 'Las pausas deben ser programadas y no deben dejar descubierta una especialidad si existen pacientes pendientes por atender.'
        },
        {
          pregunta: '¿El tiempo promedio de atención por paciente permite un equilibrio adecuado entre la productividad y la calidad diagnóstica?',
          prueba: 'Cálculo del "Tiempo Promedio de Consulta" por médico y especialidad según el registro de entrada y salida de pacientes en el sistema.',
          criterio: 'El tiempo de consulta debe oscilar entre 15 y 25 minutos para optimizar la capacidad instalada.'
        },
        {
          pregunta: '¿Se realiza una asignación equitativa de pacientes basada en la disponibilidad de la malla y el volumen de la especialidad para evitar cuellos de botella?',
          prueba: 'Revisión del aplicativo digiturno para identificar saturación en consultorios específicos mientras otros permanecen subutilizados.',
          criterio: 'La carga de pacientes debe distribuirse de manera proporcional a la capacidad operativa declarada por cada consultorio.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 3 - Apoyos Diagnósticos',
      preguntas: [
        {
          pregunta: '¿Se cumple con el estándar de tiempo institucional desde la generación de la orden médica hasta la ejecución física de la toma de muestra?',
          prueba: 'Contraste de marcas de tiempo en el sistema entre la Hora de Solicitud y la Hora de Toma (identificación de casos en estado "Retraso" como HC-1042 y HC-1051).',
          criterio: 'El intervalo de tiempo no debe exceder los 15 minutos.'
        },
        {
          pregunta: '¿Existe evidencia de seguimiento por parte de la auxiliar administradora de consultorios al paciente durante el periodo de espera de los resultados paraclínicos?',
          prueba: 'Revisión de la Tasa de Revaloración (68%) mediante la búsqueda de notas de evolución médica registradas en la Historia Clínica posteriores a la toma de muestras.',
          criterio: 'Al menos el 80% de los pacientes en espera de resultados deben contar con una nota de revaloración.'
        },
        {
          pregunta: '¿Se cumple estrictamente con el protocolo de doble verificación de identidad antes del procedimiento de venopunción o recolección?',
          prueba: 'Observación en campo del proceso de etiquetado de muestras y verificación de concordancia entre la orden del sistema y la manilla del paciente.',
          criterio: 'Cumplimiento del 100% de los protocolos de identificación segura para evitar errores pre-analíticos.'
        },
        {
          pregunta: '¿Se comunica de manera efectiva al paciente el plan de manejo y los tiempos estimados de respuesta para reducir la ansiedad y el riesgo de fuga?',
          prueba: 'Validación con el paciente / familiar mediante entrevista de auditoría sobre u observación la claridad de la información recibida por el paciente respecto a su proceso diagnóstico.',
          criterio: 'Comunicación efectiva del plan de manejo al 100% de los pacientes en espera de apoyo diagnóstico.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 4 - Revaloración y Evolución',
      preguntas: [
        {
          pregunta: '¿Se garantiza que el 100% de los pacientes con resultados de apoyo diagnóstico completos cuenten con una conducta médica definida (Alta u Hospitalización) en el tiempo estándar?',
          prueba: 'Verificación paciente de revaloraciónen el tablero de control vs. la hora de reporte del último examen paraclínico en el sistema.',
          criterio: 'La conducta debe definirse en un máximo de 15 minutos tras la disponibilidad de resultados.'
        },
        {
          pregunta: '¿Existen fallas en la interfaz entre los sistemas de apoyo (LIS/PACS) y el tablero de urgencias que retrasen la visibilidad de los resultados para el médico?',
          prueba: 'Trazabilidad de casos críticos como López V., S. (HC-1047), quien presenta 42 min de espera con apoyos "Pendientes", para determinar si es un retraso de ejecución o de carga de datos.',
          criterio: 'Los resultados deben integrarse al tablero de manera automática y sin latencia administrativa.'
        },
        {
          pregunta: '¿Se realiza un seguimiento clínico activo a los pacientes cuyo estado de revaloración excede los 30 minutos (estado "Retraso")?',
          prueba: 'Revisión de las notas de evolución en la Historia Clínica para pacientes con "Estado: Retraso" o "En curso" con tiempos superiores a la meta.',
          criterio: 'Todo paciente que supere los 30 min en este punto debe tener una nota de seguimiento que justifique técnicamente la demora.'
        },
        {
          pregunta: '¿Se cumple con la entrega formal del plan de manejo, fórmulas médicas y educación sobre signos de alarma al momento de definir el alta?',
          prueba: 'Verificación de la entrega del paquete de egreso y registro de la educación brindada en la HC (Caso de éxito: Martínez S., L.).',
          criterio: 'El proceso de alta no debe superar los 20 minutos desde la definición de la conducta hasta la liberación física del espacio.'
        },
        {
          pregunta: '¿La velocidad de evacuación de los pacientes en revaloración es suficiente para prevenir el bloqueo de los consultorios de Triage y Consulta inicial?',
          prueba: 'Análisis de la relación entre el volumen de pacientes en revaloración (actualmente 14) vs. la disponibilidad de camillas de observación o camas de piso.',
          criterio: 'El cumplimiento de los tiempos de revaloración debe mantenerse por encima del 85% para asegurar la fluidez del servicio.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 5 - Observación y Estancia Corta',
      preguntas: [
        {
          pregunta: '¿Se activan y gestionan los protocolos de "Giro-Cama" para los pacientes que superan la meta de estancia de 6 horas en el área de observación?',
          prueba: 'Análisis de causa raíz para los registros con estado "Excede meta" (casos críticos: García López, M. con 7.2h y Rodríguez P., A. con 6.8h). Verificación de si el retraso es administrativo (EPS) o asistencial.',
          criterio: 'Ningún paciente debe superar las 6 horas de estancia sin un plan de evacuación o traslado activo.'
        },
        {
          pregunta: '¿El tiempo de respuesta de los servicios transversales (Terapias, Laboratorio, Imágenes) es coherente con la necesidad de rotación de la unidad de estancia corta?',
          prueba: 'Revisión de la trazabilidad de órdenes para pacientes con > 5h de estancia que aún figuran con "Lab: Pendiente" o "Terapias: Pendiente".',
          criterio: 'La ejecución de servicios de apoyo en observación no debe exceder las 2 horas tras la orden médica.'
        },
        {
          pregunta: '¿Existe una comunicación efectiva y sin tiempos muertos entre la definición de la conducta "Hospitalizar" y la solicitud formal de cama al censo hospitalario?',
          prueba: 'Contraste de tiempos entre la marca de "Conducta" en el tablero y el registro de solicitud de cama en la plataforma de gestión hospitalaria.',
          criterio: 'El traslado efectivo a piso debe ocurrir en un máximo de 2 horas tras la definición de la conducta.'
        },
        {
          pregunta: '¿Se mantiene la continuidad del cuidado (administración de medicamentos y soporte nutricional) para los pacientes cuya estancia en urgencias se ha prolongado por falta de cama en piso?',
          prueba: 'Revisión del registro de administración de medicamentos (MAR) y el kárdex de enfermería para pacientes con más de 4 horas de estancia (actualmente 18 pacientes en el área).',
          criterio: 'Cumplimiento del 100% del esquema terapéutico programado durante la estancia en observación.'
        },
        {
          pregunta: '¿La demora en la lectura o ejecución de imágenes diagnósticas es el factor determinante en el incumplimiento de la meta de observación (78% actual)?',
          prueba: 'Verificación del estado de órdenes en el sistema PACS vs. el tablero de control (Caso: Martínez S., L. con imágenes pendientes a las 5.1h).',
          criterio: 'El tiempo total de procesamiento de imágenes en observación debe ser < 90 minutos.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 6 - Salida y Gestión de Camas',
      preguntas: [
        {
          pregunta: '¿Existe plena concordancia entre el estado de ocupación reportado en el tablero digital y la ocupación física real en el servicio?',
          prueba: 'Inspección física del cubículo U-12 (marcado como "Ocupada" con 52 min de espera) para verificar si el paciente ya egresó físicamente pero no se ha cerrado el registro.',
          criterio: 'El estado de la cama en el sistema debe actualizarse en un tiempo < 5 minutos tras la salida del paciente.'
        },
        {
          pregunta: '¿El tiempo empleado por el personal de servicios generales para la desinfección terminal cumple con los estándares de alta rotación del servicio?',
          prueba: 'Cronometrar el tiempo transcurrido desde que la cama cambia a estado "Limpieza" (ej. Cama U-08 con 18 min) hasta que queda disponible para un nuevo ingreso.',
          criterio: 'El tiempo de limpieza no debe exceder los 20 minutos.'
        },
        {
          pregunta: '¿Se cuenta con la disponibilidad inmediata de personal de camillería y equipos de transporte para ejecutar los traslados pendientes a hospitalización?',
          prueba: 'Revisión del log de solicitudes de traslado para el paciente P-0038 (Cama U-03), quien presenta 35 min en espera de movimiento físico.',
          criterio: 'El traslado efectivo debe ocurrir en < 15 minutos una vez generada la orden de movimiento.'
        },
        {
          pregunta: '¿La gestión de facturación, autorizaciones de EPS o entrega de documentos administrativos está interfiriendo con la liberación de la cama física?',
          prueba: 'Análisis del Traslados Pendiente para identificar si el bloqueo es logístico (camillería) o administrativo (paz y salvo de salida).',
          criterio: 'El proceso administrativo no debe ser un obstáculo para la rotación de camas críticas en Urgencias.'
        },
        {
          pregunta: '¿Se realiza la asignación inmediata de las camas en estado "Disponible" a los pacientes que esperan en Triage o Consulta para evitar subutilización del recurso?',
          prueba: 'Verificación del tiempo de vacancia de la cama U-15 (Estado: Disponible) vs. la lista de pacientes con conducta definida de "Hospitalizar" o "Observación".',
          criterio: 'Una cama disponible debe ser asignada en un tiempo < 10 minutos.'
        },
        {
          pregunta: '¿Se realiza la asignación de cama en hospitalizar después que el médico genera la orden de internación?',
          prueba: 'Verificación del tiempo desde la orden de internación hasta el traslado del paciente hasta la unidad funcional destinos.',
          criterio: 'Una cama disponible en hospitalización debe ser asignada en un tiempo < 120 minutos.'
        }
      ]
    },
    {
      nombre: 'Punto de Control 7 - Experiencia del Cliente',
      preguntas: [
        {
          pregunta: '¿Las áreas de espera, observación y circulación garantizan el confort del paciente y su acompañante, contando con sillas en buen estado, climatización, iluminación adecuada y baños funcionales?',
          prueba: 'Recorrido de observación directa por las instalaciones físicas y verificación del estado de los baños (abastecimiento de papel, jabón y limpieza general).',
          criterio: 'El 100% de las áreas de espera deben estar operativas y en condiciones óptimas de confort e infraestructura.'
        },
        {
          pregunta: '¿Se evidencia orden y limpieza constante en los pasillos, áreas comunes y consultorios, manteniéndolos libres de equipos médicos mal ubicados o residuos visibles?',
          prueba: 'Inspección visual de áreas críticas (Triage, Admisión, pasillos de observación) y revisión de las bitácoras de limpieza o firmas de supervisión del personal de servicios generales.',
          criterio: 'Ausencia total de residuos o acumulación de basura en áreas de tránsito, cumpliendo con los ciclos de desinfección estandarizados de la institución.'
        },
        {
          pregunta: '¿El personal administrativo y asistencial aplica los protocolos de trato humanizado, dirigiéndose al paciente por su nombre, manteniendo contacto visual y portando su identificación de manera visible?',
          prueba: 'Observación participante (técnica de cliente incógnito) durante interacciones reales en Admisiones, Triage y toma de signos vitales.',
          criterio: 'El 100% del personal debe portar carné visible y evidenciar un trato respetuoso, empático y resolutivo.'
        },
        {
          pregunta: '¿Se garantiza una comunicación proactiva y periódica con los familiares o acompañantes en la sala de espera respecto a la ubicación, estado clínico o posibles demoras en la atención del paciente?',
          prueba: 'Entrevista aleatoria a familiares en sala de espera (especialmente aquellos con más de 2 horas aguardando) para validar si han recibido reportes o "partes médicos" por parte de enfermería o el área de atención al usuario.',
          criterio: 'Se debe brindar actualización de información al familiar/acompañante al menos cada 2 horas en casos de estancias prolongadas o retrasos operativos.'
        },
        {
          pregunta: '¿Existen canales de comunicación visibles, funcionales y accesibles para que el paciente o su familia puedan registrar sus peticiones, quejas, reclamos, sugerencias o felicitaciones (PQRSF) en el área de Urgencias?',
          prueba: 'Verificación de la señalización, disponibilidad de buzones, códigos QR operativos o presencia de orientadores de atención al usuario en la sala principal.',
          criterio: 'Disponibilidad del 100% de los canales de retroalimentación habilitados e informados visiblemente al público.'
        }
      ]
    }
  ]
};
// --- INYECCIÓN AUTOMÁTICA DE PACIENTE TRAZADOR URGENCIAS ---
const preguntasTrazadorUrgencias: any[] = [];

for (let i = 0; i <= 5; i++) {
  if (flujoUrgencias.puntosControl[i]) {
    const nombrePunto = flujoUrgencias.puntosControl[i].nombre;
    // Clonamos la pregunta y le inyectamos el nombre del punto al principio
    const preguntasConEtiqueta = flujoUrgencias.puntosControl[i].preguntas.map((p: any) => ({
      ...p,
      pregunta: `[${nombrePunto}] ${p.pregunta}`
    }));
    preguntasTrazadorUrgencias.push(...preguntasConEtiqueta);
  }
}

flujoUrgencias.puntosControl.push({
  nombre: "Paciente trazador Urgencias",
  preguntas: preguntasTrazadorUrgencias
});