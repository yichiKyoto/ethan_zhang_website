import { useState } from 'react';
import { type Project } from './Projects'

export default function ProjectCard(props: Project) {
  const { images, title, github, attributes } = props;
  const [index, setIndex] = useState(0);

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setIndex(i => (i + 1) % images.length)

  return (
    <div className="inline-flex flex-col rounded-xl shadow-xl p-2 items-center w-auto">

      <div className="relative w-[600px] h-[500px] bg-white rounded-xl flex items-center justify-center">
        <p className="text-center text-xl">no image!</p>
        <img src={images[index]} className="rounded-lg w-full h-auto absolute inset-0" />
      </div>

      <div className="flex gap-2 items-center justify-center p-5">
        <h1 className="text-xl">
          {title}
        </h1>
        <div className="h-2 w-2 rounded-full bg-black">

        </div>
        <a href={github} className="text-xl hover:text-gray-500 opacity-75">
          {github}
        </a>
      </div>
      <ul className="list-outside list-disc space-y-1 pl-6 marker:text-gray-600">
        {attributes.map((attr, i) => (
          <li key={i}>{attr}</li>
        ))}
      </ul>
    </div>
  )
}
