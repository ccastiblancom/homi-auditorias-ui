export const flujoUrgencias = {
    titulo: "URGENCIAS",
    puntosControl: [
      {
        nombre: "1. Admisión y Triage",
        preguntas: [
          {
            id: "U-1-1",
            pregunta: "¿Cumple el flujo con el intervalo de tiempo establecido desde el ingreso del paciente a la sala hasta su llamado efectivo por admisiones?",
            prueba: "Cotejo del reporte de hora de llegada física vs. el Timestamp de creación del registro en el Sistema de Información Hospitalaria (HIS).",
            criterio: "El tiempo de espera en admisión debe ser < 10 minutos."
          },
          {
            id: "U-1-2",
            pregunta: "¿Se evidencia el cumplimiento del protocolo de información al paciente sobre su nivel de prioridad (I al V) y el significado de dicha clasificación?",
            prueba: "Revisión de la firma o huella del paciente en el formato de Triage/consentimiento informado y observación aleatoria de la entrega del comprobante.",
            criterio: "El 100% de los pacientes deben tener registro de haber sido informados sobre su nivel de prioridad."
          },
          {
            id: "U-1-3",
            pregunta: "¿Se garantiza que los pacientes clasificados en Nivel III reciban información sobre los tiempos de espera estimados y las pautas de alarma ante el deterioro de síntomas?",
            prueba: "Verificación en la historia clínica de la presencia de recomendaciones dadas y revisión de la activación de alertas visuales en el tablero para este grupo.",
            criterio: "Cumplimiento de meta de atención < 30 min para el volumen de pacientes en Nivel III."
          },
          {
            id: "U-1-4",
            pregunta: "¿Es el tiempo de ejecución del Triage dentro del consultorio coherente con los estándares de agilidad y enfoque clínico institucional?",
            prueba: "Análisis sistemático de los tiempos registrados entre la apertura y el cierre de la hoja de Triage en la plataforma digital.",
            criterio: "El tiempo promedio de clasificación por paciente debe ser < 10 minutos."
          },
          {
            id: "U-1-5",
            pregunta: "¿Se realiza la toma completa de signos vitales como paso obligatorio previo a la asignación definitiva del nivel de Triage?",
            prueba: "Auditoría de historias clínicas para validar el registro de tensión, frecuencia cardiaca y saturación. Análisis de desviaciones en casos donde la pertinencia es inferior al 95%.",
            criterio: "La clasificación debe estar respaldada al 100% por hallazgos clínicos objetivos para evitar la subcategorización."
          }
        ]
      }
      // Nota: Más adelante agregaremos aquí el "Punto de Control 2 - Consulta y Capacidad Instalada", etc.
    ]
  };