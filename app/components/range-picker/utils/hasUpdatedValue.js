import areMomentRangesEqual from './areMomentRangesEqual';
import areMomentValuesEqual from './areMomentValuesEqual';

export default function (previousValue, nextProps) {
  const nextValue = nextProps.value;

  return !(
    previousValue === nextValue ||
    areMomentValuesEqual(previousValue, nextValue) ||
    areMomentRangesEqual(previousValue, nextValue)
  );
}
