import { useContext, useEffect, useState } from "react";
import EditEducationCard from "./EditEducationCard";
import { deleteEducation, type Education, updateEducation } from "./backendHelpers";
import { Context } from "./Context";

export default function EducationCard(props: {
  id: number;
  university: string;
  university_zh: string;
  period: string;
  period_zh: string;
  degree: string;
  degree_zh: string;
  skills: Education['skills'];
  transcript: string;
  onUpdated: () => void;
}) {
  const { isAdmin, language } = useContext(Context);
  const [education, setEducation] = useState<Education>({ ...props });
  const { university, university_zh, period, period_zh, degree, degree_zh, skills, transcript } = education;
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const zh = language === '中文'

  useEffect(() => {
    setEducation({ ...props });
  }, [props.id, props.university, props.university_zh, props.period, props.period_zh, props.degree, props.degree_zh, props.skills, props.transcript]);

  if (isEditing) {
    return (
      <EditEducationCard
        id={props.id}
        university={university} university_zh={university_zh}
        period={period} period_zh={period_zh}
        degree={degree} degree_zh={degree_zh}
        skills={skills}
        transcript={transcript}
        setEducation={async (nextEducation) => {
          try {
            setSaving(true);
            await updateEducation(String(props.id), nextEducation);
            setEducation({ id: props.id, ...nextEducation });
            props.onUpdated();
            setIsEditing(false);
          } catch (error) {
            console.error(error);
            window.alert('Failed to update education.');
          } finally {
            setSaving(false);
          }
        }}
        onDelete={async () => {
          try {
            setDeleting(true);
            await deleteEducation(String(props.id));
            props.onUpdated();
          } catch (error) {
            console.error(error);
            window.alert('Failed to delete education.');
          } finally {
            setDeleting(false);
          }
        }}
      />
    );
  }

  return (
    <div className="flex w-[70%] flex-col gap-2 rounded-lg border-2 border-gray-300 bg-red-100 p-4 relative">
      <div className="flex flex-col justify-start">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-medium">{zh ? (university_zh || university) : university}</h2>
          <h3 className="text-lg font-medium text-gray-400">{zh ? (period_zh || period) : period}</h3>
        </div>
        <h3 className="text-lg font-medium text-gray-400">{zh ? (degree_zh || degree) : degree}</h3>
        <h4 className="mt-5 text-lg font-semibold">{zh ? '掌握的技能' : 'Skills Acquired'}</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((item, i) => (
            <span key={i} className="rounded-full bg-purple-300 px-3 py-1 text-sm font-medium text-purple-900">
              {zh ? (item.zh || item.en) : item.en}
            </span>
          ))}
        </div>
        <h4 className="mt-5 text-lg font-semibold">{zh ? '成绩单' : 'Academic Transcript'}</h4>
        {transcript !== '' ? (
          <a
            href={transcript}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit cursor-pointer text-blue-700 underline decoration-blue-700/40 underline-offset-2 hover:text-blue-900"
          >
            {zh ? '查看成绩单' : 'View Academic Transcript'}
          </a>
        ) : (
          <p className="text-sm text-gray-400">{zh ? '暂无成绩单。' : 'No transcript uploaded.'}</p>
        )}
        {isAdmin && (
          <div className="my-5 flex gap-2">
            <button
              disabled={saving || deleting}
              className="opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-xl bg-red-200 hover:bg-red-300 px-8 py-3 cursor-pointer self-start disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => setIsEditing(true)}
            >
              {zh ? '编辑' : 'Edit'}
            </button>
            <button
              disabled={deleting || saving}
              className="opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-xl bg-red-200 hover:bg-red-300 px-8 py-3 cursor-pointer self-start disabled:cursor-not-allowed disabled:opacity-60"
              onClick={async () => {
                try {
                  setDeleting(true);
                  await deleteEducation(String(props.id));
                  props.onUpdated();
                } catch (error) {
                  console.error(error);
                  window.alert('Failed to delete education.');
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? (zh ? '删除中...' : 'Deleting...') : (zh ? '删除' : 'Delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
