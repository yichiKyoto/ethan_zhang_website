import { useState } from 'react';
import { type Project } from './Projects'

export default function ProjectCard(props: Project) {
  const { images, title, github, attributes } = props;
  const [index, setIndex] = useState(0);

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setIndex(i => (i + 1) % images.length)

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full">
        <img src={images[index]} className="rounded-lg w-full h-auto" />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-1 text-white hover:bg-black/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-1 text-white hover:bg-black/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
        <div className="flex gap-2 items-center">
          <h1>
            {title}
          </h1>
          <div className="h-10 w-10 rounded-full bg-gray-200">

          </div>
          <a href={github}>
            {github}
          </a>
        </div>
        <ul className="list-outside list-disc space-y-1 pl-6 marker:text-gray-600">
          {attributes.map((attr, i) => (
            <li key={i}>{attr}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
