import { Scene, Engine, SceneLoader, HemisphericLight, Vector3, FreeCamera, CannonJSPlugin, MeshBuilder, PhysicsImpostor, ActionManager } from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";

export class PhysicsImposters {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    this.CreateImpostors();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);

    const camera = new FreeCamera(
        "camera",
        new Vector3(0, 10, -20),
        this.scene
    );

    camera.setTarget(Vector3.Zero());
    camera.attachControl();
    camera.minZ = 0.5;

    scene.enablePhysics(
        new Vector3(0, -9.81, 0),
        new CannonJSPlugin(true, 10, CANNON)
    );

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./model/",
      "Prototype_Level.glb",
      this.scene
    );

    meshes.map(mesh => {
        if (mesh.name === "Ramp") {
            mesh.dispose();
        }
        mesh.physicsImpostor = new PhysicsImpostor(
            mesh,
            PhysicsImpostor.BoxImpostor,
            {
                mass: 0,
                restitution: 0
            }
        );
    });

    // this.scene.onPointerDown = () => {
    //     const hit = this.scene.pick(this.scene.pointerX, this.scene.pointerY);

    //     console.log(hit.pickedMesh?.name);
    // }

    // this.scene.onPointerDown = function castRay() {
    //     const hit = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
    
    //     if (hit.pickedMesh && hit.pickedMesh.name == 'mysphere') {
    //       hit.pickedMesh.material = new BABYLON.StandardMaterial();
    //       hit.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
    //     }
    // }
  }

  CreateImpostors(): void {
    const box = MeshBuilder.CreateBox("box", {size: 2});

    box.position = new Vector3(0, 10, 1);
    box.rotation = new Vector3(Math.PI/4, 0, 0);

    box.physicsImpostor = new PhysicsImpostor(
        box, 
        PhysicsImpostor.BoxImpostor, 
        {
            mass: 1,
            friction: 0,
            restitution: 0.75
        }
    );

    const ground = MeshBuilder.CreateGround(
        "ground",
        {
            width: 10,
            height: 10
        }
    );

    ground.isVisible = false;

    ground.physicsImpostor = new PhysicsImpostor(
        ground,
        PhysicsImpostor.BoxImpostor,
        {
            mass: 0,
            restitution: 0.5
        }
    );

    const sphere = MeshBuilder.CreateSphere(
        "sphere",
        {
            diameter: 3
        }
    );

    sphere.position = new Vector3(0, 6, 0);

    sphere.physicsImpostor = new PhysicsImpostor(
        sphere,
        PhysicsImpostor.SphereImpostor,
        {
            mass: 1,
            restitution: 0.8
        }
    );
  }

}