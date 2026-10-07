import { useRef, useState } from 'react'
import { OutroScene } from './components/OutroScene'
import { PortraitField } from './components/PortraitField'
import { SceneNavigation } from './components/SceneNavigation'
import { SiteLoader } from './components/SiteLoader'
import { WalkingScene } from './components/WalkingScene'
import { usePageLoader } from './hooks/usePageLoader'
import { useParallax } from './hooks/useParallax'
import { useSceneNavigation } from './hooks/useSceneNavigation'
import './App.css'
import CollectionDrawer from './components/CollectionDrawer'

function App() {
  const sceneRef = useRef(null)
  const loader = usePageLoader()
  const [collectionOpen, setCollectionOpen]= useState(false)

  useParallax(sceneRef)
  useSceneNavigation(sceneRef)

  return (
    <div className="experience relative h-svh min-h-[620px] overflow-hidden bg-[#fff7e9]">
      <SiteLoader visible={loader.visible} leaving={loader.leaving} />

      <main className="floating-scene relative isolate h-svh min-h-[620px] overflow-hidden max-[620px]:min-h-[560px]" ref={sceneRef}>
        <h1 className="brand z-[60] m-0 select-none text-[#2247ab]">Paw Parade</h1>
        <PortraitField />
        <WalkingScene />
        <OutroScene />
        <SceneNavigation />
      </main>
      {/* <CollectionDrawer collectionOpen={collectionOpen} onCollectionClose={(()=>setCollectionOpen(false))} /> */}
    </div>
  )
}

export default App
