package com.circuitlearn.controller;

import com.circuitlearn.dto.LoginRequestDTO;
import com.circuitlearn.model.Usuario;
import com.circuitlearn.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

/**
 * Controller responsável pela autenticação de usuários (login, logout, status da sessão).
 */
@RestController
public class AuthController {

    @Autowired
    UsuarioRepository usuarioRepository;

    /**
     * Autentica um usuário com base em email e senha. Se as credenciais estiverem corretas,
     * armazena o usuário na sessão HTTP.
     *
     * @param request DTO com email e senha.
     * @param session A sessão HTTP para armazenar o estado de login.
     * @return O objeto do usuário em caso de sucesso ou 401 Unauthorized.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request, HttpSession session) {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            Usuario usuario = userOpt.get();
            if (usuario.getSenha().equals(request.getPassword())) {
                session.setAttribute("currentUsuario", usuario);
                return ResponseEntity.ok().body(usuario);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }

    /**
     * Retorna os dados do usuário atualmente logado na sessão.
     *
     * @param session A sessão HTTP.
     * @return O objeto do usuário ou 401 Unauthorized se ninguém estiver logado.
     */
    @GetMapping("/api/auth/user")
    public ResponseEntity<Usuario> getCurrentUser(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("currentUsuario");
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    /**
     * Realiza o logout do usuário, invalidando sua sessão.
     * Usa POST porque a ação altera o estado no servidor.
     *
     * @param session A sessão HTTP a ser invalidada.
     * @return Uma mensagem de sucesso.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().body("Logout bem-sucedido");
    }
}