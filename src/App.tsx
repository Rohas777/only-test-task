import styles from './App.module.scss';
import { HistoricalDates } from './components';
import * as slidersJson from './data/sliders.json'
import { ISlider } from './models/ISlider';

function App() {
  const sliders: ISlider[] = (slidersJson as any).default || slidersJson;

  return (
    <div className={styles.App}>
        <HistoricalDates sliders={sliders} />
    </div>
  );
}

export default App;
