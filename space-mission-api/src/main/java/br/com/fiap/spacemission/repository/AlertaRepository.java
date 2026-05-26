package br.com.fiap.spacemission.repository;

import br.com.fiap.spacemission.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByNivel(Alerta.NivelAlerta nivel);

    List<Alerta> findByResolvido(Boolean resolvido);

    List<Alerta> findBySistemaOrigemIgnoreCase(String sistemaOrigem);

    List<Alerta> findByResolvidoFalseOrderByNivelDesc();
}
