package br.com.fiap.spacemission.service;

import br.com.fiap.spacemission.model.EventoOperacional;
import br.com.fiap.spacemission.repository.EventoOperacionalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoOperacionalService {

    private final EventoOperacionalRepository eventoRepository;

    public EventoOperacionalService(EventoOperacionalRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public List<EventoOperacional> listarTodos() {
        return eventoRepository.findAll();
    }

    public Optional<EventoOperacional> buscarPorId(Long id) {
        return eventoRepository.findById(id);
    }

    public List<EventoOperacional> buscarPorTipo(EventoOperacional.TipoEvento tipo) {
        return eventoRepository.findByTipo(tipo);
    }

    public List<EventoOperacional> buscarPorSistema(String sistema) {
        return eventoRepository.findBySistemaIgnoreCase(sistema);
    }

    public List<EventoOperacional> buscarPorFaseMissao(String faseMissao) {
        return eventoRepository.findByFaseMissaoIgnoreCase(faseMissao);
    }

    public EventoOperacional salvar(EventoOperacional evento) {
        return eventoRepository.save(evento);
    }

    public boolean deletar(Long id) {
        if (eventoRepository.existsById(id)) {
            eventoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
