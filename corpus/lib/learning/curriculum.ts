import type { Lesson, QuizQuestion, Structure, SystemId } from "@/lib/types";

/**
 * Curriculum source of truth.
 *
 * In production this is read from Supabase (`systems`, `structures`,
 * `lessons`). It is kept as a typed module here so the UI, the tutor's
 * grounding step and the RAG index all resolve the same identifiers.
 */

export const SYSTEMS: { id: SystemId; name: string; latin: string; count: number }[] = [
  { id: "skeletal", name: "Skeletal", latin: "Systema sceleti", count: 206 },
  { id: "muscular", name: "Muscular", latin: "Systema musculare", count: 600 },
  { id: "nervous", name: "Nervous", latin: "Systema nervosum", count: 86 },
  { id: "cardiovascular", name: "Cardiovascular", latin: "Systema cardiovasculare", count: 4 },
  { id: "respiratory", name: "Respiratory", latin: "Systema respiratorium", count: 11 },
  { id: "digestive", name: "Digestive", latin: "Systema digestorium", count: 14 },
];

export const STRUCTURES: Structure[] = [
  {
    id: "st-heart",
    system: "cardiovascular",
    latin: "Cor",
    name: "Heart",
    summary:
      "A four-chambered muscular pump driving the pulmonary and systemic circuits at roughly 70 beats per minute at rest.",
    model: "cor",
    related: ["st-aorta", "st-sa-node"],
  },
  {
    id: "st-aorta",
    system: "cardiovascular",
    latin: "Aorta",
    name: "Aorta",
    summary:
      "The largest artery in the body; receives the entire left ventricular output and distributes it through the systemic circulation.",
    model: "aorta",
    related: ["st-heart"],
  },
  {
    id: "st-sa-node",
    system: "cardiovascular",
    latin: "Nodus sinuatrialis",
    name: "Sinoatrial node",
    summary:
      "The primary pacemaker of the heart, setting intrinsic rhythm from the superior wall of the right atrium.",
    related: ["st-heart"],
  },
  {
    id: "st-femur",
    system: "skeletal",
    latin: "Os femoris",
    name: "Femur",
    summary:
      "The longest and strongest bone of the body, articulating proximally with the acetabulum and distally with the tibia.",
    model: "femur",
    related: ["st-tibia"],
  },
  {
    id: "st-tibia",
    system: "skeletal",
    latin: "Tibia",
    name: "Tibia",
    summary:
      "The weight-bearing bone of the leg, transmitting load from the femur to the talus.",
    related: ["st-femur"],
  },
  {
    id: "st-brainstem",
    system: "nervous",
    latin: "Truncus encephali",
    name: "Brainstem",
    summary:
      "Midbrain, pons and medulla oblongata — the conduit for every tract between brain and spinal cord, and the seat of cardiorespiratory control.",
    model: "brainstem",
    related: ["st-cerebellum"],
  },
  {
    id: "st-cerebellum",
    system: "nervous",
    latin: "Cerebellum",
    name: "Cerebellum",
    summary:
      "Coordinates voluntary movement, posture and balance, holding more neurons than the rest of the brain combined.",
    related: ["st-brainstem"],
  },
  {
    id: "st-diaphragm",
    system: "respiratory",
    latin: "Diaphragma",
    name: "Diaphragm",
    summary:
      "The principal muscle of inspiration; its contraction flattens the dome and generates the negative intrathoracic pressure that draws air in.",
    model: "diaphragm",
    related: ["st-lung"],
  },
  {
    id: "st-lung",
    system: "respiratory",
    latin: "Pulmo",
    name: "Lung",
    summary:
      "Paired organs of gas exchange, subdivided into lobes and supplied by the bronchial tree.",
    model: "lung",
    related: ["st-diaphragm"],
  },
];

export const LESSONS: Lesson[] = [
  {
    id: "les-heart-chambers",
    system: "cardiovascular",
    title: "Chambers of the Heart",
    summary:
      "Trace a single red blood cell from the vena cava to the aorta and name every chamber and valve it passes.",
    minutes: 18,
    level: 1,
    structures: ["st-heart", "st-aorta"],
    blocks: [
      {
        kind: "text",
        body: "The heart is a double pump. The right side receives deoxygenated blood and sends it to the lungs; the left side receives oxygenated blood and sends it to the body. Understanding the sequence of chambers is the foundation of every cardiac examination.",
      },
      {
        kind: "structure",
        structureId: "st-heart",
        caption: "Coronal section — isolate the right atrium, then the left ventricle.",
      },
      {
        kind: "callout",
        tone: "clinical",
        body: "A murmur heard best at the apex and radiating to the axilla is most consistent with mitral regurgitation — the valve sits between the left atrium and left ventricle.",
      },
      { kind: "quiz", questionId: "q-1" },
      { kind: "quiz", questionId: "q-2" },
    ],
  },
  {
    id: "les-conduction",
    system: "cardiovascular",
    title: "The Conduction System",
    summary:
      "How the sinoatrial node sets the rhythm, and where a block turns rhythm into arrhythmia.",
    minutes: 22,
    level: 2,
    structures: ["st-sa-node", "st-heart"],
    blocks: [
      {
        kind: "text",
        body: "Impulse generation begins in the sinoatrial node, travels through the atria to the atrioventricular node, down the bundle of His and out through the Purkinje fibres. Each delay has a signature on the ECG.",
      },
      {
        kind: "structure",
        structureId: "st-sa-node",
        caption: "Superior wall of the right atrium, at the junction with the superior vena cava.",
      },
      { kind: "quiz", questionId: "q-3" },
    ],
  },
  {
    id: "les-femur",
    system: "skeletal",
    title: "Femur & the Hip Joint",
    summary:
      "Landmarks of the proximal femur and why the femoral neck is the classic fracture site.",
    minutes: 15,
    level: 1,
    structures: ["st-femur", "st-tibia"],
    blocks: [
      {
        kind: "text",
        body: "The femur transmits the whole weight of the trunk to the lower limb. Its neck is the weakest link, and its blood supply is why intracapsular fractures behave so differently from extracapsular ones.",
      },
      {
        kind: "structure",
        structureId: "st-femur",
        caption: "Rotate to the posterior view to find the linea aspera.",
      },
      { kind: "quiz", questionId: "q-4" },
    ],
  },
  {
    id: "les-brainstem",
    system: "nervous",
    title: "Brainstem & Cranial Nerves",
    summary:
      "Midbrain, pons, medulla — and the twelve nerves that emerge between them.",
    minutes: 26,
    level: 3,
    structures: ["st-brainstem", "st-cerebellum"],
    blocks: [
      {
        kind: "text",
        body: "Every long tract between the brain and the spinal cord passes through roughly ten cubic centimetres of brainstem. Lesions here produce crossed findings: ipsilateral cranial nerve deficits with contralateral body signs.",
      },
      {
        kind: "structure",
        structureId: "st-brainstem",
        caption: "Mid-sagittal cut — identify the cerebral aqueduct.",
      },
      { kind: "quiz", questionId: "q-5" },
    ],
  },
  {
    id: "les-diaphragm",
    system: "respiratory",
    title: "Mechanics of Breathing",
    summary:
      "The diaphragm, the intercostals, and the pressures that move air.",
    minutes: 16,
    level: 2,
    structures: ["st-diaphragm", "st-lung"],
    blocks: [
      {
        kind: "text",
        body: "Quiet inspiration is active; quiet expiration is passive. The diaphragm descends, thoracic volume rises, intrapleural pressure falls, and air follows the gradient.",
      },
      {
        kind: "structure",
        structureId: "st-diaphragm",
        caption: "Inferior view — the three major hiatuses at T8, T10 and T12.",
      },
      { kind: "quiz", questionId: "q-6" },
    ],
  },
];

export const QUIZ: QuizQuestion[] = [
  {
    id: "q-1",
    lessonId: "les-heart-chambers",
    prompt: "Blood returning from the systemic circulation first enters which chamber?",
    options: ["Left atrium", "Right atrium", "Right ventricle", "Left ventricle"],
    correctIndex: 1,
    explanation:
      "The superior and inferior venae cavae drain into the right atrium, which then passes blood through the tricuspid valve into the right ventricle.",
  },
  {
    id: "q-2",
    lessonId: "les-heart-chambers",
    prompt: "Which valve guards the exit from the left ventricle?",
    options: ["Tricuspid", "Pulmonary", "Mitral", "Aortic"],
    correctIndex: 3,
    explanation:
      "The aortic valve sits between the left ventricle and the ascending aorta; the mitral valve guards the inlet.",
  },
  {
    id: "q-3",
    lessonId: "les-conduction",
    prompt: "The heart's primary pacemaker is the:",
    options: ["Atrioventricular node", "Bundle of His", "Sinoatrial node", "Purkinje fibres"],
    correctIndex: 2,
    explanation:
      "The sinoatrial node depolarises fastest intrinsically and therefore sets the sinus rhythm.",
  },
  {
    id: "q-4",
    lessonId: "les-femur",
    prompt: "Which femoral landmark is a ridge on the posterior shaft?",
    options: ["Greater trochanter", "Linea aspera", "Medial condyle", "Fovea capitis"],
    correctIndex: 1,
    explanation:
      "The linea aspera is the rough longitudinal ridge giving attachment to the adductor group.",
  },
  {
    id: "q-5",
    lessonId: "les-brainstem",
    prompt: "The cerebral aqueduct is found in which brainstem division?",
    options: ["Medulla oblongata", "Pons", "Midbrain", "Diencephalon"],
    correctIndex: 2,
    explanation:
      "The aqueduct runs through the midbrain, connecting the third and fourth ventricles.",
  },
  {
    id: "q-6",
    lessonId: "les-diaphragm",
    prompt: "The oesophageal hiatus of the diaphragm lies at which vertebral level?",
    options: ["T8", "T10", "T12", "L1"],
    correctIndex: 1,
    explanation: "IVC at T8, oesophagus at T10, aortic hiatus at T12.",
  },
];

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id);
}

export function getStructure(id: string) {
  return STRUCTURES.find((s) => s.id === id);
}

export function getQuestion(id: string) {
  return QUIZ.find((q) => q.id === id);
}

export function lessonsForSystem(system: SystemId) {
  return LESSONS.filter((l) => l.system === system);
}
