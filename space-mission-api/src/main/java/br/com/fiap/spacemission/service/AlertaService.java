package br.com.fiap.spacemission.service;

import br.com.fiap.spacemission.model.Alerta;
import br.com.fiap.spacemission.repository.AlertaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AlertaService {

    private final AlertaRepository alertaRepository;

    public AlertaService(AlertaRepository alertaRepository) {
        this.alertaRepository = alertaRepository;
    }

    public List<Alerta> listarTodos() {
        return alertaRepository.findAll();
    }

    public Optional<Alerta> buscarPorId(Long id) {
        return alertaRepository.findById(id);
    }

    public List<Alerta> buscarPorNivel(Alerta.NivelAlerta nivel) {
        return alertaRepository.findByNivel(nivel);
    }

    public List<Alerta> buscarNaoResolvidos() {
        return alertaRepository.findByResolvidoFalseOrderByNivelDesc();
    }

    public List<Alerta> buscarPorSistema(String sistema) {
        return alertaRepository.findBySistemaOrigemIgnoreCase(sistema);
    }

    public Alerta salvar(Alerta alerta) {
        return alertaRepository.save(alerta);
    }

    public Optional<Alerta> resolver(Long id, String resolucao) {
        return alertaRepository.findById(id).map(alerta -> {
            alerta.setResolvido(true);
            alerta.setResolucao(resolucao);
            alerta.setResolvidoEm(LocalDateTime.now());
            return alertaRepository.save(alerta);
        });
    }

    public boolean deletar(Long id) {
        if (alertaRepository.existsById(id)) {
            alertaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
