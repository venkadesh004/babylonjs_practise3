import { Scene, Engine, SceneLoader, CubeTexture, FreeCamera, Vector3, AmmoJSPlugin, MeshBuilder, PhysicsImpostor, Mesh } from "@babylonjs/core";
import "@babylonjs/loaders";
// import Ammo from "ammojs-typed";

export class PhysicsForces {
  scene: Scene;
  engine: Engine;
  camera!: FreeCamera;
  cannonball!: Mesh;
  ground!: Mesh;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.CreateEnvironment();
    this.CreatePhysics();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);

    const envTex = CubeTexture.CreateFromPrefilteredData(
        "./environment/sky.env",
        scene
    );

    envTex.gammaSpace = false;
    envTex.rotationY = Math.PI/2;

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true, 1000, 0.25);

    const camera = new FreeCamera(
        "camera",
        new Vector3(0, 2, -10),
        this.scene
    );
    camera.attachControl();
    camera.minZ = 0.5;

    this.camera = camera;

    return scene;
  }

  async CreatePhysics(): Promise<void> {
    // const ammo = await Ammo();
    // const physics = new AmmoJSPlugin(true, ammo);
    // this.scene.enablePhysics(new Vector3(0, -9.81, 0), physics);

    this.CreateImpostors();
  }

  async CreateEnvironment(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./model/",
      "Prototype_Level_new.glb",
      this.scene
    );
  }

  CreateImpostors(): void {
    const ground = MeshBuilder.CreateGround(
        "ground",
        {
            width: 40,
            height: 40
        }
    );
    ground.isVisible = false;

    ground.physicsImpostor = new PhysicsImpostor(
        ground,
        PhysicsImpostor.BoxImpostor,
        {
            mass: 0,
            restitution: 1
        }
    );

    this.ground = ground;
  }

  CreateImpluse(): void {

    const box = MeshBuilder.CreateBox(
      "box",
      {size: 2}
    );

    

  }

}
