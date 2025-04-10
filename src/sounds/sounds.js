import { Howl } from 'howler';
import Acerto from './acerto.mp3';
import Erro from './erro.mp3';
import Vitoria from './vitoria.mp3';

export const somAcerto = new Howl({ src: [Acerto] });
export const somErro = new Howl({ src: [Erro] });
export const somVitoria = new Howl({ src: [Vitoria] });
