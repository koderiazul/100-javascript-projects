import SevenSegClock from "../pages/seven-seg-clock/seven-seg-clock.js";
import MainLayout from "../layouts/main-layout.js";
import ProjectLayout from "../layouts/project-layout.js";
import Stopwatch from "../pages/stopwatch/stopwatch.js";
import ImageGallery from "../pages/image-gallery/image-gallery.js";
import Calculator from "../pages/calculator/calculator.js";
import TintShadeMaker from "../pages/tint-shade-maker/tint-shade-maker.js";
import ColorPicker from "../pages/color-picker/color-picker.js";

const routes = [
  {
    path: "/",
    view: () => `
      <h1>Home Page</h1>
      <p>Welcome to the homepage of our SPA!</p>
    `,
    layout: MainLayout,
  },
  {
    path: "/seven-seg-clock",
    view: SevenSegClock.view,
    mount: SevenSegClock.mount,
    layout: ProjectLayout,
  },
  {
    path: "/stopwatch",
    view: Stopwatch.view,
    mount: Stopwatch.mount,
    layout: ProjectLayout,
  },
  {
    path: "/image-gallery",
    view: ImageGallery.view,
    mount: ImageGallery.mount,
    layout: ProjectLayout,
  },
  {
    path: "/calculator",
    view: Calculator.view,
    mount: Calculator.mount,
    layout: ProjectLayout,
  },
   {
    path: "/tint-shade-maker",
    view: TintShadeMaker.view,
    mount: TintShadeMaker.mount,
    layout: ProjectLayout,
  },
  {
    path: "/color-picker",
    view: ColorPicker.view,
    mount: ColorPicker.mount,
    layout: ProjectLayout,
  },
];

export default routes;
