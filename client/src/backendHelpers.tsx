import { supabase } from './supabaseClient'

export type Skill = {
  en: string
  zh: string
}

export type Education = {
  id: number
  university: string
  university_zh: string
  degree: string
  degree_zh: string
  period: string
  period_zh: string
  skills: Skill[]
  transcript: string
}

export type NewEducation = Omit<Education, 'id'>

export const fetchAllEducation = async (): Promise<Education[]> => {
  const { data, error } = await supabase
    .from('education')
    .select('id, university, university_zh, degree, degree_zh, period, period_zh, transcript, skills(skill, skill_zh)')
    .order('id')

  if (error) throw new Error(error.message)

  return (data ?? []).map((row: any) => ({
    id: row.id,
    university: row.university,
    university_zh: row.university_zh,
    degree: row.degree,
    degree_zh: row.degree_zh,
    period: row.period,
    period_zh: row.period_zh,
    transcript: row.transcript,
    skills: (row.skills ?? []).map((s: any) => ({ en: s.skill as string, zh: s.skill_zh as string })),
  }))
}

export const addEducation = async (education: NewEducation): Promise<Education> => {
  const { data, error } = await supabase
    .from('education')
    .insert({
      university: education.university,
      university_zh: education.university_zh,
      period: education.period,
      period_zh: education.period_zh,
      degree: education.degree,
      degree_zh: education.degree_zh,
      transcript: education.transcript,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (education.skills.length > 0) {
    const { error: skillsError } = await supabase
      .from('skills')
      .insert(education.skills.map(skill => ({ education_id: data.id, skill: skill.en, skill_zh: skill.zh })))
    if (skillsError) throw new Error(skillsError.message)
  }

  return { ...data, skills: education.skills }
}

export const updateEducation = async (id: string, education: NewEducation): Promise<void> => {
  const { error: deleteError } = await supabase
    .from('skills')
    .delete()
    .eq('education_id', id)
  if (deleteError) throw new Error(deleteError.message)

  if (education.skills.length > 0) {
    const { error: skillsError } = await supabase
      .from('skills')
      .insert(education.skills.map(skill => ({ education_id: Number(id), skill: skill.en, skill_zh: skill.zh })))
    if (skillsError) throw new Error(skillsError.message)
  }

  const { error } = await supabase
    .from('education')
    .update({
      university: education.university,
      university_zh: education.university_zh,
      period: education.period,
      period_zh: education.period_zh,
      degree: education.degree,
      degree_zh: education.degree_zh,
      transcript: education.transcript,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export const deleteEducation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export type WorkSkill = {
  en: string
  zh: string
}

export type WorkExperience = {
  id: number
  company: string
  company_zh: string
  position: string
  position_zh: string
  period: string
  period_zh: string
  skills: WorkSkill[]
}

export type NewWorkExperience = Omit<WorkExperience, 'id'>

export const fetchAllWorkExperience = async (): Promise<WorkExperience[]> => {
  const { data, error } = await supabase
    .from('work_experience')
    .select('id, company, company_zh, position, position_zh, period, period_zh, work_skills(skill, skill_zh)')
    .order('id')

  if (error) throw new Error(error.message)

  return (data ?? []).map((row: any) => ({
    id: row.id,
    company: row.company,
    company_zh: row.company_zh,
    position: row.position,
    position_zh: row.position_zh,
    period: row.period,
    period_zh: row.period_zh,
    skills: (row.work_skills ?? []).map((s: any) => ({ en: s.skill as string, zh: s.skill_zh as string })),
  }))
}

export const addWorkExperience = async (work: NewWorkExperience): Promise<WorkExperience> => {
  const { data, error } = await supabase
    .from('work_experience')
    .insert({
      company: work.company,
      company_zh: work.company_zh,
      position: work.position,
      position_zh: work.position_zh,
      period: work.period,
      period_zh: work.period_zh,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (work.skills.length > 0) {
    const { error: skillsError } = await supabase
      .from('work_skills')
      .insert(work.skills.map(s => ({ work_id: data.id, skill: s.en, skill_zh: s.zh })))
    if (skillsError) throw new Error(skillsError.message)
  }

  return { ...data, skills: work.skills }
}

export const updateWorkExperience = async (id: string, work: NewWorkExperience): Promise<void> => {
  const { error: deleteError } = await supabase
    .from('work_skills')
    .delete()
    .eq('work_id', id)
  if (deleteError) throw new Error(deleteError.message)

  if (work.skills.length > 0) {
    const { error: skillsError } = await supabase
      .from('work_skills')
      .insert(work.skills.map(s => ({ work_id: Number(id), skill: s.en, skill_zh: s.zh })))
    if (skillsError) throw new Error(skillsError.message)
  }

  const { error } = await supabase
    .from('work_experience')
    .update({
      company: work.company,
      company_zh: work.company_zh,
      position: work.position,
      position_zh: work.position_zh,
      period: work.period,
      period_zh: work.period_zh,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export const deleteWorkExperience = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('work_experience')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export const uploadTranscript = async (id: number, file: File): Promise<string> => {
  const filePath = `transcript_${id}.pdf`

  const { error: uploadError } = await supabase.storage
    .from('transcripts')
    .upload(filePath, file, { upsert: true, contentType: 'application/pdf' })
  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage
    .from('transcripts')
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('education')
    .update({ transcript: data.publicUrl })
    .eq('id', id)
  if (updateError) throw new Error(updateError.message)

  return data.publicUrl
}

export type ProjectAttribute = {
  en: string
  zh: string
}

export type Project = {
  id: number
  title: string
  title_zh: string
  github: string
  images: string[]
  attributes: ProjectAttribute[]
}

export type NewProject = Omit<Project, 'id'>

export const getAllProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, title_zh, github_link, project_attributes(attribute, attribute_zh), project_images(image_url)')
    .order('id')

  if (error) throw new Error(error.message)

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    title_zh: row.title_zh,
    github: row.github_link,
    attributes: (row.project_attributes ?? []).map((a: any) => ({ en: a.attribute as string, zh: a.attribute_zh as string })),
    images: (row.project_images ?? []).map((img: any) => img.image_url as string),
  }))
}

export const updateProject = async (id: string, project: NewProject): Promise<void> => {
  const numId = Number(id)

  const { error: delAttrError } = await supabase.from('project_attributes').delete().eq('project_id', numId)
  if (delAttrError) throw new Error(delAttrError.message)

  const { error: delImgError } = await supabase.from('project_images').delete().eq('project_id', numId)
  if (delImgError) throw new Error(delImgError.message)

  const { error } = await supabase
    .from('projects')
    .update({ title: project.title, title_zh: project.title_zh, github_link: project.github })
    .eq('id', numId)
  if (error) throw new Error(error.message)

  await Promise.all([
    ...project.images.map(url => addProjectImage(numId, url)),
    ...project.attributes.map(attr => addProjectAttribute(numId, attr)),
  ])
}

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export const addProjectAttribute = async (projectId: number, attribute: ProjectAttribute): Promise<void> => {
  const { error } = await supabase
    .from('project_attributes')
    .insert({ project_id: projectId, attribute: attribute.en, attribute_zh: attribute.zh })
  if (error) throw new Error(error.message)
}

export const uploadProjectImage = async (projectId: number, file: File): Promise<string> => {
  const filePath = `project_${projectId}_${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(filePath, file, { upsert: false })
  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}


export const addProjectImage = async (projectId: number, imageUrl: string): Promise<void> => {
  const { error } = await supabase
    .from('project_images')
    .insert({ project_id: projectId, image_url: imageUrl })
  if (error) throw new Error(error.message)
}

export const addProject = async (title: string, title_zh: string, githubLink: string, imageFiles: File[], attributes: ProjectAttribute[]): Promise<void> => {
  const { data, error } = await supabase
    .from('projects')
    .insert({ title, title_zh, github_link: githubLink })
    .select()
    .single()
  if (error) throw new Error(error.message)

  const imageUrls = await Promise.all(imageFiles.map(file => uploadProjectImage(data.id, file)))

  await Promise.all([
    ...imageUrls.map(url => addProjectImage(data.id, url)),
    ...attributes.map(attr => addProjectAttribute(data.id, attr)),
  ])
}

// ── Profile Photo ──────────────────────────────────────────────────────────

export const fetchProfilePhoto = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'profile_photo')
    .single()
  if (error) return null
  return data?.value ?? null
}

export const uploadProfilePhoto = async (file: File): Promise<string> => {
  const filePath = `profile.${file.name.split('.').pop()}`
  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, { upsert: true })
  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from('profile-photos').getPublicUrl(filePath)
  const url = `${data.publicUrl}?t=${Date.now()}`

  const { error: upsertError } = await supabase
    .from('settings')
    .upsert({ key: 'profile_photo', value: url }, { onConflict: 'key' })
  if (upsertError) throw new Error(upsertError.message)

  return url
}

// ── Gym Cards ──────────────────────────────────────────────────────────────

export type GymCard = {
  id: number
  image_url: string
  description_en: string
  description_zh: string
}

export const getAllGymCards = async (): Promise<GymCard[]> => {
  const { data, error } = await supabase
    .from('gym_card')
    .select('id, image_url, description_en, description_zh')
    .order('id')
  if (error) throw new Error(error.message)
  console.log(data);
  return data ?? []
}

export const uploadGymImage = async (id: number, file: File): Promise<string> => {
  const filePath = `gym_${id}_${Date.now()}_${file.name}`
  const { error: uploadError } = await supabase.storage
    .from('gym-images')
    .upload(filePath, file, { upsert: false })
  if (uploadError) throw new Error(uploadError.message)
  const { data } = supabase.storage.from('gym-images').getPublicUrl(filePath)
  return data.publicUrl
}

export const addGymCard = async (imageFile: File, description_en: string, description_zh: string): Promise<void> => {
  const { data, error } = await supabase
    .from('gym_card')
    .insert({ description_en, description_zh, image_url: '' })
    .select()
    .single()
  if (error) throw new Error(error.message)

  const imageUrl = await uploadGymImage(data.id, imageFile)

  const { error: updateError } = await supabase
    .from('gym_card')
    .update({ image_url: imageUrl })
    .eq('id', data.id)
  if (updateError) throw new Error(updateError.message)
}

export const updateGymCard = async (id: string, description_en: string, description_zh: string, imageFile?: File): Promise<void> => {
  let image_url: string | undefined
  if (imageFile) {
    image_url = await uploadGymImage(Number(id), imageFile)
  }
  const { error } = await supabase
    .from('gym_card')
    .update({ description_en, description_zh, ...(image_url ? { image_url } : {}) })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export const deleteGymCard = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('gym_card')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
