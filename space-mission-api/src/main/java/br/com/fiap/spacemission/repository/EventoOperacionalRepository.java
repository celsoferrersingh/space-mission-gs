package br.com.fiap.spacemission.repository;

import br.com.fiap.spacemission.model.EventoOperacional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoOperacionalRepository extends JpaRepository<EventoOperacional, Long> {

    List<EventoOperacional> findByTipo(EventoOperacional.TipoEvento tipo);

    List<EventoOperacional> findBySistemaIgnoreCase(String sistema);

    List<EventoOperacional> findByFaseMissaoIgnoreCase(String faseMissao);
}
