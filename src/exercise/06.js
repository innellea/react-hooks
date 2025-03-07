// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import {
    PokemonForm,
    fetchPokemon,
    PokemonInfoFallback,
    PokemonDataView,
} from '../pokemon';

function PokemonInfo({ pokemonName }) {
    // const [pokemon, setPokemon] = React.useState(null);
    // const [error, setError] = React.useState(null);
    // const [status, setStatus] = React.useState('idle');
    const [state, setState] = React.useState({
        status: 'idle',
        pokemon: null,
        error: null,
    });
    const { status, pokemon, error } = state;

    React.useEffect(() => {
        if (!pokemonName) {
            return;
        }
        setState({ status: 'pending' });
        fetchPokemon(pokemonName).then(
            (pokemon) => {
                setState({ status: 'resolved', pokemon });
            },
            (error) => {
                setState({ status: 'rejected', error });
            }
        );
    }, [pokemonName]);

    if (status === 'idle') {
        return 'Submit a pokemon';
    } else if (status === 'pending') {
        return <PokemonInfoFallback name={pokemonName} />;
    } else if (status === 'rejected') {
        // this will be handled by an error boundary
        throw error;
    } else if (status === 'resolved') {
        return <PokemonDataView pokemon={pokemon} />;
    }

    throw new Error('This should be impossible');
}

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div>
            There was an error:
            <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
};
function App() {
    const [pokemonName, setPokemonName] = React.useState('');

    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName);
    }

    return (
        <div className='pokemon-info-app'>
            <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
            <hr />
            <div className='pokemon-info'>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => {
                        // reset the state of your app so the error doesn't happen again
                        setPokemonName('');
                    }}
                    resetKeys={[pokemonName]}
                >
                    <PokemonInfo pokemonName={pokemonName} />
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default App;
