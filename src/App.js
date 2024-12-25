import "./styles.css";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
} from "reactstrap";
export default function App() {
  const [pokemonData, setPokemonData] = useState();
  const [pokemon, setPokemon] = useState();
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const handleImageClick = (id) => {
    setPokemon(id);
    setModal(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      const getPokemonData = await fetch("https://pokeapi.co/api/v2/pokemon");
      const pokemonDataParsed = await getPokemonData.json();
      // console.log(pokemonDataParsed);

      const eachPokemonDetail = await Promise.all(
        pokemonDataParsed.results.map(async (pokemon) => {
          const fetchPokemon = await fetch(pokemon.url);
          return fetchPokemon.json();
        })
      );

      setPokemonData(eachPokemonDetail);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <div className="pokemons">
        {pokemonData &&
          pokemonData.map((pokemon, idx) => (
            <Card key={idx}>
              <img
                src={pokemon.sprites.front_default}
                onClick={() => {
                  handleImageClick(pokemon);
                }}
              />
              <CardHeader>{pokemon.name}</CardHeader>

              <CardBody></CardBody>
            </Card>
          ))}
      </div>

      {pokemon && (
        <Modal
          isOpen={modal}
          toggle={toggleModal}
          contentClassName="custom-modal" // Add custom class
        >
          <ModalHeader className="custom-modal-header">
            Details of {pokemon.name}
          </ModalHeader>

          <ModalBody className="custom-modal-body">
            <img
              src={pokemon.sprites.front_default}
              alt={`${pokemon.name} sprite`}
              style={{ width: "150px", height: "150px", marginBottom: "10px" }}
            />
            <p>
              <strong>Height:</strong> {pokemon.height}
            </p>
            <p>
              <strong>Weight:</strong> {pokemon.weight}
            </p>
            <p>
              <strong>Abilities:</strong>
            </p>
            <ul>
              {pokemon.abilities.map((ability, idx) => (
                <li key={idx}>{ability.ability.name}</li>
              ))}
            </ul>

            <Button
              color="secondary"
              onClick={toggleModal}
              style={{ marginTop: "10px" }}
            >
              Close
            </Button>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
