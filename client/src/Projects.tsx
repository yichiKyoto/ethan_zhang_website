import { useState, useEffect, useContext } from "react";
import NavBar from "./NavBar"
import ProjectCard from "./ProjectCard";
export type { Project } from "./backendHelpers"
import { getAllProjects, type Project } from "./backendHelpers"
import { Context } from "./Context";
import AddProjectModal from "./AddProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const { language, isAdmin } = useContext(Context);
  const isChinese = language === "中文";

  const loadProjects = () => {
    getAllProjects().then(setProjects)
  }

  useEffect(() => {
    loadProjects()
  }, []);

  return (
    <div className="h-[100dvh] flex flex-col">
      <NavBar/>
      <div className="flex-1 bg-red-100 p-5 flex flex-col gap-5">
        <div className="flex justify-between items-center">
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

        <div className="flex-1 rounded-xl bg-red-200 overflow-y-auto shadow-md flex flex-col p-8 items-center">
          {projects.map((project) => {
            const { title, github, images, attributes } = project;
            return (
              <ProjectCard key={project.id} id={project.id} title={title} github={github} images={images} attributes={attributes}/>
            )
          })}
        </div>
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
