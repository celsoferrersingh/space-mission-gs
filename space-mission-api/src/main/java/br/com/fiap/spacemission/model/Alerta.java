package br.com.fiap.spacemission.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_alerta")
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NivelAlerta nivel;

    @NotBlank(message = "A mensagem do alerta é obrigatória")
    @Column(nullable = false, length = 500)
    private String mensagem;

    @NotBlank(message = "O sistema de origem é obrigatório")
    @Column(name = "sistema_origem", nullable = false, length = 100)
    private String sistemaOrigem;

    @Column(name = "codigo_alerta", length = 30)
    private String codigoAlerta;

    @Column(name = "valor_detectado")
    private Double valorDetectado;

    @Column(name = "valor_limite")
    private Double valorLimite;

    @Column(name = "resolvido", nullable = false)
    private Boolean resolvido = false;

    @Column(name = "resolucao", length = 300)
    private String resolucao;

    @Column(name = "gerado_em", nullable = false, updatable = false)
    private LocalDateTime geradoEm;

    @Column(name = "resolvido_em")
    private LocalDateTime resolvidoEm;

    public Alerta() {}

    public Alerta(Long id, NivelAlerta nivel, String mensagem, String sistemaOrigem,
                  String codigoAlerta, Double valorDetectado, Double valorLimite,
                  Boolean resolvido, String resolucao,
                  LocalDateTime geradoEm, LocalDateTime resolvidoEm) {
        this.id = id;
        this.nivel = nivel;
        this.mensagem = mensagem;
        this.sistemaOrigem = sistemaOrigem;
        this.codigoAlerta = codigoAlerta;
        this.valorDetectado = valorDetectado;
        this.valorLimite = valorLimite;
        this.resolvido = resolvido;
        this.resolucao = resolucao;
        this.geradoEm = geradoEm;
        this.resolvidoEm = resolvidoEm;
    }

    @PrePersist
    public void prePersist() {
        this.geradoEm = LocalDateTime.now();
        if (this.resolvido == null) {
            this.resolvido = false;
        }
    }

    // Getters
    public Long getId() { return id; }
    public NivelAlerta getNivel() { return nivel; }
    public String getMensagem() { return mensagem; }
    public String getSistemaOrigem() { return sistemaOrigem; }
    public String getCodigoAlerta() { return codigoAlerta; }
    public Double getValorDetectado() { return valorDetectado; }
    public Double getValorLimite() { return valorLimite; }
    public Boolean getResolvido() { return resolvido; }
    public String getResolucao() { return resolucao; }
    public LocalDateTime getGeradoEm() { return geradoEm; }
    public LocalDateTime getResolvidoEm() { return resolvidoEm; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setNivel(NivelAlerta nivel) { this.nivel = nivel; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public void setSistemaOrigem(String sistemaOrigem) { this.sistemaOrigem = sistemaOrigem; }
    public void setCodigoAlerta(String codigoAlerta) { this.codigoAlerta = codigoAlerta; }
    public void setValorDetectado(Double valorDetectado) { this.valorDetectado = valorDetectado; }
    public void setValorLimite(Double valorLimite) { this.valorLimite = valorLimite; }
    public void setResolvido(Boolean resolvido) { this.resolvido = resolvido; }
    public void setResolucao(String resolucao) { this.resolucao = resolucao; }
    public void setGeradoEm(LocalDateTime geradoEm) { this.geradoEm = geradoEm; }
    public void setResolvidoEm(LocalDateTime resolvidoEm) { this.resolvidoEm = resolvidoEm; }

    public enum NivelAlerta {
        BAIXO, MEDIO, ALTO, CRITICO
    }
}
