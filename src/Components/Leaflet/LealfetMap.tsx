import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { InfoCard } from '../InfoCard';
import { get } from '../../Services/ApiUtils';
import ModalProposta from '../ModalProposta';

// Corrigindo o problema dos ícones do Leaflet no React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const randomLocation = () => {
    return (Math.floor(Math.random() * 401) - 200) * 0.0001;
}

const LocationInfoMap = () => {
    const [position, _setPosition] = useState({ lat: -15.7801, lng: -47.9292 }); // Brasil - Brasília
    const [markers, setMarkers] = useState<any[]>([]);
    const [locationData, setLocationData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [mapLoading, setMapLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const fetchpopupdata = async (lat: number, lng: number) => {
        setMapLoading(true);
        try {
            const response: any = await get(`getLocationInfo?latitude=${lat.toFixed(6)}&longitude=${lng.toFixed(6)}`)
            return response.data;
        } finally {
            setMapLoading(false);
        }
    }

    const fetchLocationData = async (maker: any) => {
        setLoading(true);
        setError(null);

        try {


            const simulatedData = {
                id: maker.locationData.id,
                city: maker.locationData.bairro || "Bairro Simulado",
                state: maker.locationData.cidade || "Cidade Simulada",
                population: maker.locationData.populacaoCidade,
                valorMetroQuadrado: maker.locationData.temperaturaMediana, // Valor do m² entre 3000 e 8000
                climate: maker.locationData.clima,
                economicActivity: maker.locationData.atividadeEconomica,
                averageTemperature: maker.locationData.temperaturaMediana,
                timeZone: maker.locationData.fuso,
                coordinates: { lat: maker.locationData.latitude, lng: maker.locationData.longitude },
                infraestrutura: {
                    escolas: maker.locationData.estrutura.escolas,
                    hospitais: maker.locationData.estrutura.hospitais,
                    shoppings: maker.locationData.estrutura.shoppings,
                    parques: maker.locationData.estrutura.parques
                },
                indiceValorizacao: maker.locationData.valorizacaoMedia, // Valorização anual entre 5% e 15%
                distanciaCentro: maker.locationData.distanciaAoCentro, // Distância do centro em km
                iptu: maker.locationData.iptuMedia, // IPTU entre 0.5% e 1% do valor
                allData: maker.locationData
            };

            setLocationData(simulatedData);

        } catch (err) {
            setError("Falha ao carregar dados da localização. Tente novamente.");
            console.error("Erro ao buscar dados:", err);
        } finally {
            setLoading(false);
        }
    };

    // Componente para capturar eventos do mapa
    const MapEvents = () => {
        useMapEvents({
            async click(e) {
                // const newMarker = {
                //   id: Date.now(),
                //   position: e.latlng
                // };

                const locationData = await fetchpopupdata(e.latlng.lat, e.latlng.lng);
                console.log("locationData:", locationData);
                const itens = 5;

                const locations = []
                for (let i = 0; i < itens; i++) {

                    const lat = e.latlng.lat + randomLocation();
                    const lng = e.latlng.lng + randomLocation();

                    locations.push({
                        id: Date.now() + i,
                        position: { lat, lng },
                        locationData
                    })
                }

                setMarkers(locations);
                return;
            }
        });
        return null;
    };

    return (
        <div className="flex flex-col lg:flex-row h-[600px] max-sm:h-[630px] bg-gray-100">
            <div className="w-full lg:w-full h-full relative">
                <MapContainer
                    center={position}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {markers.map(marker => (
                        <Marker
                            key={marker.id}
                            position={marker.position}
                            eventHandlers={{
                                click: () => {
                                    fetchLocationData(marker);
                                }
                            }}
                        >
                            <Popup>
                                <div className='bg-white max-w-sm'>
                                    <h2 className='text-2xl font-bold text-blue-600 mb-1'>{marker.locationData.edificio}</h2>
                                    <span className='text-sm text-gray-600 pb-2'>{marker.locationData.bairro}, {marker.locationData.regiao}</span>
                                    <div className='space-y-3'>
                                        <div className='bg-gray-100 p-2 rounded flex flex-col'>
                                            <span className='text-sm font-semibold text-gray-600 p'>Unidades disponíveis</span>
                                            <span className='text-lg font-bold text-gray-800'>{marker.locationData.unidadesDisponiveis}</span>
                                        </div>
                                        <div className='bg-gray-100 p-2 rounded flex flex-col'>
                                            <span className='text-sm font-semibold text-gray-600'>Média de valores</span>
                                            <span className='text-lg font-bold text-green-600'>
                                                R$ {marker.locationData.mediaValorPorUnidade.min},00 - R$ {marker.locationData.mediaValorPorUnidade.max},00
                                            </span>
                                        </div>
                                        <div className='grid grid-cols-2 gap-2'>
                                            <div className='bg-gray-100 p-2 rounded flex flex-col'>
                                                <span className='text-xs font-semibold text-gray-600'>Área total</span>
                                                <span className='text-base font-bold text-purple-600'>
                                                    {marker.locationData.areaTotal.min} - {marker.locationData.areaTotal.max} m²
                                                </span>
                                            </div>
                                            <div className='bg-gray-100 p-2 rounded flex flex-col'>
                                                <span className='text-xs font-semibold text-gray-600'>Valor do m²</span>
                                                <span className='text-base font-bold text-blue-600'>
                                                    R$ {(Math.floor(Math.random() * 5000) + 3000).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className='mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105'
                                        onClick={() => {
                                            // Aqui você pode adicionar a lógica para gerar o relatório
                                            setOpen(true);
                                        }}
                                    >
                                        Ver mais e gerar relatório
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    <MapEvents />
                </MapContainer>
                
                {mapLoading && (
                    <div className="absolute inset-0 flex justify-center items-center  z-[999]" style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}>
                        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-3"></div>
                            <p className="text-gray-700 font-semibold">Carregando dados da localização...</p>
                        </div>
                    </div>
                )}
            </div>

            {open &&
                <div className='absolute top-0 left-0 w-screen h-screen flex justify-center items-center backdrop-blur-sm' style={{
                    zIndex: 1000,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <div className="w-full lg:w-3/5 p-6 overflow-y-auto">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Informações da Localização</h2>
                                <button
                                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 ease-in-out focus:outline-none"
                                    onClick={() => setOpen(false)}
                                    aria-label="Fechar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className='flex flex-col gap-4 max-h-[65vh] overflow-y-auto'>
                                {loading && (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                                        <p>{error}</p>
                                    </div>
                                )}

                                {locationData && !loading && (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-lg font-semibold">{locationData.city}, {locationData.state}</p>
                                            <p className="text-sm text-gray-600">
                                                Coordenadas: {locationData.coordinates.lat}, {locationData.coordinates.lng}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InfoCard
                                                title="População da cidade"
                                                value={locationData.population.toLocaleString()}
                                                icon="👥"
                                            />
                                            <InfoCard
                                                title="Valor do m²"
                                                value={`R$ ${locationData.valorMetroQuadrado.toLocaleString()}`}
                                                icon="💰"
                                            />
                                            <InfoCard
                                                title="Clima"
                                                value={locationData.climate}
                                                icon="🌤️"
                                            />
                                            <InfoCard
                                                title="Temperatura Média"
                                                value={`${locationData.averageTemperature}°C`}
                                                icon="🌡️"
                                            />
                                            <InfoCard
                                                title="Fuso Horário"
                                                value={locationData.timeZone}
                                                icon="🕒"
                                            />
                                            <InfoCard
                                                title="Atividade Econômica"
                                                value={locationData.economicActivity}
                                                icon="💼"
                                            />
                                        </div>

                                        <div>
                                            <h2 className='text-2xl font-bold text-gray-800'>Relatório</h2>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                            <h3 className="text-lg font-semibold text-blue-700">Infraestrutura Local</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center">
                                                    <span className="mr-2">🏫</span>
                                                    <span>{locationData.infraestrutura.escolas} escolas próximas</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-2">🏥</span>
                                                    <span>{locationData.infraestrutura.hospitais} hospitais</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-2">🛍️</span>
                                                    <span>{locationData.infraestrutura.shoppings} shoppings</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-2">🌳</span>
                                                    <span>{locationData.infraestrutura.parques} parques</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <h3 className="text-lg font-semibold text-green-700">Potencial de Investimento</h3>
                                                <p className="mt-1">Valorização média anual: <span className="font-bold text-green-600">{locationData.indiceValorizacao}%</span></p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg space-y-3 mt-4">
                                            <h3 className="text-lg font-semibold text-blue-700">Informações Fiscais e Legais</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 rounded shadow-sm">
                                                    <p className="text-sm text-gray-600">IPTU (% do valor)</p>
                                                    <p className="text-lg font-bold text-red-600">{locationData.iptu}%</p>
                                                </div>
                                                <div className="bg-white p-3 rounded shadow-sm">
                                                    <p className="text-sm text-gray-600">Distância do centro</p>
                                                    <p className="text-lg font-bold text-blue-600">{locationData.distanciaCentro} km</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg space-y-3 mt-4">
                                            <h3 className="text-lg font-semibold text-blue-700">Análise de Mercado</h3>
                                            <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm mb-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Demanda de locação</p>
                                                    <div className="flex items-center mt-1">
                                                        {Array(5).fill(0).map((_, i) => (
                                                            <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Liquidez</p>
                                                    <p className="text-lg font-bold text-green-600">Alta</p>
                                                </div>
                                            </div>
                                        </div>




                                    </div>
                                )}


                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <ModalProposta locationData={locationData} />

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText('https://www.google.com');
                                        alert('Link copiado para clipboard');
                                    }}
                                    className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Compartilhar
                                </button>


                            </div>
                        </div>


                    </div>
                </div>
            }
        </div>
    );
};

// Componente auxiliar para renderizar cards de informação

export default LocationInfoMap;