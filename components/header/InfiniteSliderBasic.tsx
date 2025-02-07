import { InfiniteSlider } from '@/components/ui/infinite-slider';

export function InfiniteSliderBasic() {
  return (
    <InfiniteSlider gap={24} reverse className=''>
        <p className='text-lg font-bold dark:text-gray-400 text-gray-600'>Envios gratis en compras superiores a $50.000 pesos</p>
        <p className='text-lg font-bold dark:text-gray-400 text-gray-600'>Envios gratis en compras superiores a $50.000 pesos</p>
        <p className='text-lg font-bold dark:text-gray-400 text-gray-600'>Envios gratis en compras superiores a $50.000 pesos</p>
        <p className='text-lg font-bold dark:text-gray-400 text-gray-600'>Envios gratis en compras superiores a $50.000 pesos</p>
        <p className='text-lg font-bold dark:text-gray-400 text-gray-600'>Envios gratis en compras superiores a $50.000 pesos</p>
    </InfiniteSlider>
  );
}
