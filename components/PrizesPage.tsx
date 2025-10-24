import React, { useState, useMemo } from 'react';
// FIX: Add .tsx extension to fix module resolution error.
import { useApp } from '../App.tsx';
import { CheckCircleIcon } from './icons'; // Assuming CheckCircleIcon is available

const prizeData = {
  1: {
    points: 250,
    nextLevel: 380,
    items: [
      { name: 'Reloj digital', image: '/images/premios/reloj_digital.png' },
      { name: 'Giftcard', image: '/images/premios/giftcard.png' },
      { name: 'Secadora', image: '/images/premios/secadora.png' },
    ]
  },
  2: {
    points: 380,
    nextLevel: 500,
    items: [
      { name: 'Olla arrocera', image: '/images/premios/olla_arrocera.png' },
      { name: 'Plancha a vapor', image: '/images/premios/plancha_a_vapor.png' },
      { name: 'Hervidor eléctrico', image: '/images/premios/hervidor_electrico.png' },
    ]
  },
  3: {
    points: 500,
    nextLevel: 1000,
    items: [
      { name: 'Pack X3 sartenes', image: '/images/premios/pack_sartenes.png' },
      { name: 'Juego de ollas', image: '/images/premios/juego_ollas.png' },
      { name: 'Pack Sandwichera + Hervidor', image: '/images/premios/pack_sandwichera_hervidor.png' },
    ]
  },
};


const PrizesPage: React.FC = () => {
    const { userData, redeemPrize } = useApp();
    const [activeLevel, setActiveLevel] = useState(2);
    const [selectedPrizes, setSelectedPrizes] = useState<{ [level: number]: string }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentLevelData = prizeData[activeLevel];
    const userHasEnoughPoints = userData.points >= currentLevelData.points;
    const isLevelRedeemed = !!userData.redeemedPrizes[activeLevel];
    
    const progressPercentage = useMemo(() => {
        if (!userHasEnoughPoints) return 0;
        const previousLevelPoints = activeLevel > 1 ? prizeData[activeLevel - 1].points : 0;
        const totalPointsForLevel = currentLevelData.points - previousLevelPoints;
        const userProgressInLevel = userData.points - previousLevelPoints;
        return Math.min((userProgressInLevel / totalPointsForLevel) * 100, 100);
    }, [userData.points, activeLevel]);

    const handleSelectPrize = (prizeName: string) => {
        if (isLevelRedeemed) return;
        setSelectedPrizes(prev => ({
            ...prev,
            [activeLevel]: prev[activeLevel] === prizeName ? '' : prizeName
        }));
    };

    const handleRedeem = () => {
        if (!selectedPrizes[activeLevel] || !userHasEnoughPoints || isLevelRedeemed) return;
        setIsModalOpen(true);
    };

    const confirmRedemption = () => {
        const prizeName = selectedPrizes[activeLevel];
        redeemPrize(activeLevel, prizeName, currentLevelData.points);
        setIsModalOpen(false);
    };

    const canRedeem = userHasEnoughPoints && !!selectedPrizes[activeLevel] && !isLevelRedeemed;

    return (
        <div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                        <h2 className="text-xl font-bold mb-4">Confirmar Canje</h2>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que quieres canjear <span className="font-bold">{selectedPrizes[activeLevel]}</span> por <span className="font-bold">{currentLevelData.points} puntos</span>?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-200 rounded">Cancelar</button>
                            <button onClick={confirmRedemption} className="px-6 py-2 bg-red-600 text-white rounded">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="text-sm text-gray-500 mb-4">INICIO | PREMIOS</div>

            <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-1 bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex space-x-2 border-b mb-6">
                        {[1, 2, 3].map(level => (
                            <button
                                key={level}
                                onClick={() => setActiveLevel(level)}
                                className={`px-4 py-2 text-sm font-semibold rounded-t-md ${activeLevel === level ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                {level}er. Nivel
                            </button>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Tienes {userData.points} puntos!</h2>
                    
                    <div className="bg-gray-100 p-4 rounded-md mb-6">
                        <p className="font-semibold text-sm text-gray-700 mb-2">{activeLevel}er. Nivel: {currentLevelData.points} puntos</p>
                         {userHasEnoughPoints ? (
                            <p className="text-sm text-green-600 font-semibold">¡Conseguiste los puntos! 🎉</p>
                         ) : (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Te faltan {currentLevelData.points - userData.points} puntos para alcanzar este premio</p>
                                <div className="w-full bg-gray-300 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                            </div>
                         )}
                    </div>

                    <h3 className="font-semibold text-gray-700 mb-4">Elige tu premio:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        {currentLevelData.items.map(item => {
                            const isSelected = selectedPrizes[activeLevel] === item.name;
                            const isRedeemed = isLevelRedeemed && userData.redeemedPrizes[activeLevel] === item.name;

                            return (
                                <div key={item.name} className="text-center">
                                    <div
                                        onClick={() => handleSelectPrize(item.name)}
                                        className={`relative border-2 rounded-lg p-4 transition-all duration-200 ${
                                            isSelected && !isLevelRedeemed ? 'border-red-500 shadow-md' : 'border-transparent'
                                        } ${!isLevelRedeemed ? 'cursor-pointer hover:shadow-lg' : ''} ${isRedeemed ? 'border-green-500' : ''}`}
                                    >
                                        <img src={item.image} alt={item.name} className="h-32 mx-auto mb-2"/>
                                        <p className="font-bold text-lg text-gray-900 mt-2">{item.name}</p>
                                        {isRedeemed && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">Canjeado</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {canRedeem && (
                        <div className="text-center mt-6">
                            <button onClick={handleRedeem} className="bg-red-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-red-700 transition">
                                Canjear Premio
                            </button>
                        </div>
                    )}
                    <p className="text-center text-sm text-gray-500 mt-8">¡Compra, acumula puntos y llévate el premio que más te inspire este mes con Topitop!</p>
                </main>

                <aside className="lg:w-80 flex-shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Condiciones para ganarlo</h3>
                        <p className="font-semibold text-red-600 text-sm mb-3">» ¡Gana premios con tus compras Topitop!</p>
                        <p className="text-sm text-gray-600 mb-4">Aprovecha esta gran oportunidad:</p>
                        <ul className="space-y-3 text-xs text-gray-600 list-disc list-inside">
                            <li>Realiza tus compras del 1 al 31 de enero.</li>
                            <li>desde 250 puntos ya accedes a tu primer premio.</li>
                            <li>En cada nivel encontrarás 3 opciones de premios para elegir el que mas te guste.</li>
                            <li>Recuerda: los premios no son acumulativos.</li>
                            <li>Participan todos los inscritos que realicen compras dentro del mes calendario.</li>
                        </ul>
                    </div>
                    <div className="bg-gray-300 rounded-lg h-32 flex items-center justify-center">
                         <img src="https://picsum.photos/seed/gana-mas-banner/300/100" className="object-cover" alt="gana mas" />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PrizesPage;
