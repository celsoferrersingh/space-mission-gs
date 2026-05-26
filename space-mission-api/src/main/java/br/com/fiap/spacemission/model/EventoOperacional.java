package br.com.fiap.spacemission.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_evento_operacional")
public class EventoOperacional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O sistema é obrigatório")
    @Column(nullable = false, length = 100)
    private String sistema;

    @NotBlank(message = "A descrição é obrigatória")
    @Column(nullable = false, length = 500)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoEvento tipo = TipoEvento.INFO;

    @Column(name = "operador", length = 100)
    private String operador;

    @Column(name = "fase_missao", length = 80)
    private String faseMissao;

    @Column(name = "duracao_segundos")
    private Integer duracaoSegundos;

    @Column(name = "registrado_em", nullable = false, updatable = false)
    private LocalDateTime registradoEm;

    public EventoOperacional() {}

    public EventoOperacional(Long id, String sistema, String descricao, TipoEvento tipo,
                             String operador, String faseMissao, Integer duracaoSegundos,
                             LocalDateTime registradoEm) {
        this.id = id;
        this.sistema = sistema;
        this.descricao = descricao;
        this.tipo = tipo;
        this.operador = operador;
        this.faseMissao = faseMissao;
        this.duracaoSegundos = duracaoSegundos;
        this.registradoEm = registradoEm;
    }

    @PrePersist
    public void prePersist() {
        this.registradoEm = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getSistema() { return sistema; }
    public String getDescricao() { return descricao; }
    public TipoEvento getTipo() { return tipo; }
    public String getOperador() { return operador; }
    public String getFaseMissao() { return faseMissao; }
    public Integer getDuracaoSegundos() { return duracaoSegundos; }
    public LocalDateTime getRegistradoEm() { return registradoEm; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setSistema(String sistema) { this.sistema = sistema; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setTipo(TipoEvento tipo) { this.tipo = tipo; }
    public void setOperador(String operador) { this.operador = operador; }
    public void setFaseMissao(String faseMissao) { this.faseMissao = faseMissao; }
    public void setDuracaoSegundos(Integer duracaoSegundos) { this.duracaoSegundos = duracaoSegundos; }
    public void setRegistradoEm(LocalDateTime registradoEm) { this.registradoEm = registradoEm; }

    public enum TipoEvento {
        INFO, NORMAL, CRITICO, EMERGENCIA, MANUTENCAO
    }
}
