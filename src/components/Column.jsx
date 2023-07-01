import './Column.css'

import { shallow } from 'zustand/shallow'
import { useState } from 'react'

import { useStore } from '../store'

import Task from './Task'
import classNames from 'classnames'

export default function Column({ state }) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)

  const tasks = useStore(
    (store) => store.tasks.filter((task) => task.state === state),
    shallow
  )

  const addTask = useStore((store) => store.addTask)

  const setDraggedTask = useStore((store) => store.setDraggedTask)
  const draggedTask = useStore((store) => store.draggedTask)
  const moveTask = useStore((store) => store.moveTask)

  return (
    <div
      className={classNames('column', { drop: drop })}
      onDragOver={(e) => {
        setDrop(true)
        e.preventDefault()
      }}
      onDragLeave={(e) => {
        setDrop(false)
        e.preventDefault()
      }}
      onDrop={(e) => {
        setDrop(false)
        moveTask(draggedTask, state)
        setDraggedTask(null)
      }}
    >
      <div className="titleWrapper">
        <p>{state}</p>
        <button onClick={() => setOpen(true)}>ADD</button>
      </div>
      {tasks.map((task, i) => (
        <Task title={task.title} key={i} />
      ))}
      {open && (
        <div className="Modal">
          <div className="modalContent">
            <input onChange={(e) => setText(e.target.value)} value={text} />
            <button
              onClick={() => {
                addTask(text, state)
                setText('')
                setOpen(false)
              }}
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
