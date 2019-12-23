import createEngine, {
  DiagramModel,
  RightAngleLinkFactory,
} from '@projectstorm/react-diagrams';
import PortFactory from '../Port/PortFactory';

export default class DiagramEngine {
  constructor(components) {
    this.locked = false;

    this.initializeEngine(components);
    this.initializeModel();
  }

  initializeEngine = components => {
    this.engine = createEngine({
      registerDefaultZoomCanvasAction: false,
    });

    // TODO: this may not be the best way to disallow loose links
    const state = this.engine.getStateMachine().getCurrentState();
    if (state) {
      state.dragNewLink.config.allowLooseLinks = false;
    }

    this.engine.getPortFactories().registerFactory(new PortFactory());

    this.engine
      .getLinkFactories()
      .registerFactory(new RightAngleLinkFactory());

    this.registerComponents(components);
  };

  initializeModel = () => {
    this.model = new DiagramModel();

    this.model.setGridSize(15);
    this.model.setLocked(false);
    this.model.registerListener({
      eventDidFire: this.realignGrid,
    });

    this.engine.setModel(this.model);
  };

  getEngine = () => this.engine;

  registerComponents = components => {
    components.forEach(component => {
      this.engine.getNodeFactories().registerFactory(component);
    });
  };

  serialize = () => this.model.serialize();

  load = circuit => {
    this.model.deserializeModel(circuit, this.engine);
    this.realignGrid({
      offsetX: this.model.getOffsetX(),
      offsetY: this.model.getOffsetY(),
    });
    setTimeout(() => this.engine.repaintCanvas());
  };

  setLocked = locked => {
    this.model.setLocked(locked);
    this.locked = locked;
  };

  isLocked = () => this.locked;

  realignGrid = ({ offsetX, offsetY }) => {
    document.body.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
  };

  getRelativeMousePoint = event =>
    this.engine.getRelativeMousePoint(event);

  addComponent = component => this.model.addNode(component);

  repaint = () => this.engine.repaintCanvas();
}
