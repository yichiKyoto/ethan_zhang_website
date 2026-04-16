import { useState, useEffect, useContext } from "react";
import NavBar from "./NavBar"
import ProjectCard from "./ProjectCard";
export type { Project } from "./backendHelpers"
import { getAllProjects, type Project } from "./backendHelpers"
import { Context } from "./Context";
import AddProjectModal from "./AddProjectModal";
import LoadingSpinner from "./LoadingSpinner";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const { language, isAdmin, menuOpen } = useContext(Context);
  const isChinese = language === "中文";

  const loadProjects = () => {
    getAllProjects().then(setProjects).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProjects()
  }, []);

  return (
    <div className={`h-[100dvh] flex flex-col w-[100dvw] ${menuOpen && "max-md:overflow-hidden"}`}>
      <NavBar bgColor="bg-purple-100" txtColor="black"/>
      <div className="flex-1 bg-red-100 p-5 flex flex-col gap-5 w-full">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl">
            {isChinese ? '项目' : 'Projects'}
          </h1>
          {isAdmin && (
            <button
              className="cursor-pointer rounded-xl bg-red-200 px-8 py-3 opacity-80 transition-opacity duration-300 hover:bg-red-300 hover:opacity-100"
              onClick={() => setShowAddModal(true)}
            >
              {isChinese ? '添加项目' : 'Add Project'}
            </button>
          )}
        </div>
        {
          loading ? (
            <div className="flex-1 rounded-xl bg-red-200 overflow-y-auto shadow-md p-8 grid gap-6 auto-rows-min w-full">
              <LoadingSpinner/>
            </div>
          ) : (
            <div className="w-full flex-1 rounded-xl bg-red-200 overflow-y-auto shadow-md p-8 flex flex-col gap-6 md:grid md:auto-rows-min md:grid-cols-[repeat(auto-fill,minmax(600px,1fr))]">
              {projects.map((project, index) => {
              const { title, github, images, attributes, title_zh } = project;
              return (
                <ProjectCard key={project.id} id={project.id} title={title} title_zh={title_zh} github={github} images={images} attributes={attributes} index={index} handleDelete={(index) => {
                  setProjects((prev) => {
                    const newProjects = [... prev]
                    newProjects.splice(index, 1);
                    return newProjects;
                  });
                }}/>
              )
              })}
            </div>
          )
        }


      </div>

      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onAdded={loadProjects}
        />
      )}
    </div>
  )
}
