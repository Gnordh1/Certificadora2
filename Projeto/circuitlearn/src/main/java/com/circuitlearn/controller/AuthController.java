
package com.circuitlearn.controller;

import com.circuitlearn.dto.CadastroRequestDTO;
import com.circuitlearn.dto.LoginRequestDTO;
import com.circuitlearn.model.Usuario;
import com.circuitlearn.repository.UsuarioRepository;
import com.circuitlearn.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller responsável pela autenticação de usuários (login, logout, status da sessão).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService; // Injetar o novo serviço

    /**
     * Registra um novo usuário no sistema.
     * @param request DTO com nome, email e senha.
     * @return O usuário criado (sem a senha) ou uma mensagem de erro.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CadastroRequestDTO request) {
        try {
            Usuario usuarioSalvo = usuarioService.registrar(request);
            usuarioSalvo.setSenha(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Autentica um usuário com base em email e senha.
     * @param request DTO com email e senha.
     * @param session A sessão HTTP para armazenar o estado de login.
     * @return O objeto do usuÃ¡rio em caso de sucesso ou 401 Unauthorized.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request, HttpSession session) {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            Usuario usuario = userOpt.get();
            // Verificação com senha em texto plano
            if (usuario.getSenha().equals(request.getPassword())) {
                session.setAttribute("currentUsuario", usuario);
                usuario.setSenha(null); // Ocultar senha da resposta
                return ResponseEntity.ok(usuario);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas. Tente novamente.");
    }

    /**
     * Retorna os dados do usuário atualmente logado na sessão.
     * @param session A sessão HTTP.
     * @return O objeto do usuÃ¡rio ou 401 Unauthorized se ninguÃ©m estiver logado.
     */
    @GetMapping("/user")
    public ResponseEntity<Usuario> getCurrentUser(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("currentUsuario");
        if (usuario != null) {
            usuario.setSenha(null); // Ocultar senha da resposta
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    /**
     * Realiza o logout do usuário, invalidando sua sessão.
     * @param session A sessão HTTP a ser invalidada.
     * @return Uma mensagem de sucesso.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().body("Logout bem-sucedido");
    }
}