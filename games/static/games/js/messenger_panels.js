/* ============================================================
   MondongoGames - Paneles tipo Messenger (solo JS)
   - Mensajes (threads + chat)
   - Amigos (lista + peticiones)
   - Añadir amigo (modal)
   Requiere APIs en /api/* (ver games/urls.py)
   ============================================================ */



(function(){
  const $ = (id) => document.getElementById(id);

  // Botones navbar
  const btnMessages = $("btnOpenContacts");
  const btnFriends = $("btnFriends");

  // Paneles
  const messagesPanel = $("messagesPanel");
  const friendsPanel  = $("friendsPanel");
  const backdrop      = $("mgBackdrop");
  const btnCloseMessages = $("btnCloseMessages");
  const btnCloseFriends  = $("btnCloseFriends");

  // Mensajes UI
  const threadsList = $("mgThreadsList");
  const chatEmpty   = $("mgChatEmpty");
  const chatWrap    = $("mgChat");
  const chatBody    = $("mgChatBody");
  const chatForm    = $("mgChatForm");
  const chatInput   = $("mgChatInput");
  const sendBtn     = $("mgSendBtn");
  const chatName    = $("mgChatName");
  const chatAvatar  = $("mgChatAvatar");
  const searchThreads = $("mgSearchThreads");
  const btnOpenFriendsFromMessages = $("btnOpenFriendsFromMessages");

  // Amigos UI
  const friendsList = $("mgFriendsList");
  const requestsBox = $("mgRequests");
  const incomingBox = $("mgIncoming");
  const outgoingBox = $("mgOutgoing");
  const btnOpenAddFriend = $("btnOpenAddFriend");

  // Modal añadir amigo
  const addFriendModal = $("mgAddFriendModal");
  const addFriendForm  = $("mgAddFriendForm");
  const addFriendInput = $("mgAddFriendInput");
  const addFriendStatus = $("mgAddFriendStatus");
  const closeAddFriend = $("mgCloseAddFriend");
  const unreadBadge = $("mgUnreadBadge");

async function refreshUnread(){
  try{
    const r = await api('/api/messages/unread-count/');
    const n = Number(r.count || 0);

    if(unreadBadge){
      unreadBadge.textContent = n > 99 ? "99+" : String(n);
      unreadBadge.hidden = (n === 0);
    }
  }catch(e){
    // si falla, oculto el badge para no mostrar 0 falso
    if(unreadBadge) unreadBadge.hidden = true;
  }
}

// refresca cada 2s
setInterval(refreshUnread, 2000);
refreshUnread();

  let activeChatUserId = null;
  let threadsCache = [];
  // ✅ al inicio: no hay chat seleccionado, deshabilitar envío
if (chatInput) chatInput.disabled = true;
if (sendBtn) sendBtn.disabled = true;

  function getCookie(name){
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if(parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  const csrftoken = getCookie('csrftoken');

  async function api(url, opts={}){
    const options = {
      headers: {
        'Content-Type': 'application/json',
        ...(opts.headers || {})
      },
      credentials: 'same-origin',
      ...opts,
    };
    if(options.method && options.method.toUpperCase() !== 'GET'){
      options.headers['X-CSRFToken'] = csrftoken;
    }
    const r = await fetch(url, options);
    let j = null;
    try{ j = await r.json(); }catch(e){}
    if(!r.ok){
      const msg = (j && j.error) ? j.error : `Error ${r.status}`;
      throw new Error(msg);
    }
    return j;
  }

  function openPanel(panel){
    if(!panel || !backdrop) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden','false');
    backdrop.classList.add('show');
  }
  function closePanel(panel){
    if(!panel || !backdrop) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
    if(!messagesPanel.classList.contains('open') && !friendsPanel.classList.contains('open')){
      backdrop.classList.remove('show');
    }
  }
  function closeAll(){
    closePanel(messagesPanel);
    closePanel(friendsPanel);
    if (mgPollTimer) { clearInterval(mgPollTimer); mgPollTimer = null; }
  }

  if(backdrop) backdrop.addEventListener('click', closeAll);
  if(btnCloseMessages) btnCloseMessages.addEventListener('click', () => closePanel(messagesPanel));
  if(btnCloseFriends) btnCloseFriends.addEventListener('click', () => closePanel(friendsPanel));

  if(btnMessages){
    btnMessages.addEventListener('click', async () => {
      openPanel(messagesPanel);
      await loadThreads();
    });
  }
  if(btnFriends){
    btnFriends.addEventListener('click', async () => {
      openPanel(friendsPanel);
      await loadFriends();
    });
  }
  if(btnOpenFriendsFromMessages){
    btnOpenFriendsFromMessages.addEventListener('click', async () => {
      openPanel(friendsPanel);
      await loadFriends();
    });
  }

  // Tabs amigos
  document.querySelectorAll('[data-friendtab]').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('[data-friendtab]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const tab = btn.getAttribute('data-friendtab');
      if(tab === 'friends'){
        friendsList.hidden = false;
        requestsBox.hidden = true;
        await loadFriends();
      }else{
        friendsList.hidden = true;
        requestsBox.hidden = false;
        await loadRequests();
      }
    });
  });

  if(btnOpenAddFriend) btnOpenAddFriend.addEventListener('click', openAddFriendModal);

  function openAddFriendModal(){
    if(!addFriendModal) return;
    addFriendStatus.textContent = '';
    addFriendInput.value = '';
    addFriendModal.classList.add('open');
    addFriendModal.setAttribute('aria-hidden','false');
    setTimeout(() => addFriendInput.focus(), 50);
  }
  function closeAddFriendModal(){
    if(!addFriendModal) return;
    addFriendModal.classList.remove('open');
    addFriendModal.setAttribute('aria-hidden','true');
  }
  if(closeAddFriend) closeAddFriend.addEventListener('click', closeAddFriendModal);
  if(addFriendModal){
    addFriendModal.addEventListener('click', (e) => {
      if(e.target === addFriendModal) closeAddFriendModal();
    });
  }

  if(addFriendForm){
    addFriendForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = (addFriendInput.value || '').trim();
      if(!q){ addFriendStatus.textContent = 'Escribe un username o correo.'; return; }
      addFriendStatus.textContent = 'Enviando...';
      try{
        const r = await api('/api/friends/request/send/', {method:'POST', body: JSON.stringify({q})});
        addFriendStatus.textContent = r.auto_accepted ? '✅ Solicitud aceptada automáticamente. Ya son amigos.' : '✅ Solicitud enviada.';
        await loadRequests();
        await loadFriends();
      }catch(err){
        addFriendStatus.textContent = '❌ ' + err.message;
      }
    });
  }

  async function loadThreads(){
    if(!threadsList) return;
    threadsList.innerHTML = `<div class="mg-empty">Cargando...</div>`;
    try{
      const r = await api('/api/messages/threads/');
      threadsCache = r.threads || [];
      renderThreads(threadsCache);
    }catch(err){
      threadsList.innerHTML = `<div class="mg-empty">❌ ${err.message}</div>`;
    }
  }

  function renderThreads(list){
    if(!list || list.length === 0){
      threadsList.innerHTML = `<div class="mg-empty">No hay amigos añadidos. Agrega amigos para chatear.</div>`;
      sendBtn.disabled = true;
      chatInput.disabled = true;
      return;
    }
    sendBtn.disabled = false;
    chatInput.disabled = false;

    threadsList.innerHTML = '';
    list.forEach(t => {
      const u = t.user;
      const last = t.last_message ? t.last_message.body : 'Sin mensajes aún';
      const div = document.createElement('div');
      div.className = 'mg-item' + (activeChatUserId === u.id ? ' is-active' : '');
      div.innerHTML = `
        <img class="mg-avatar" src="${u.avatar || '/static/games/img/default_user.png'}" alt="">
        <div class="mg-item__meta">
          <div class="mg-item__name">${escapeHtml(u.username)}</div>
          <div class="mg-item__last">${escapeHtml(last)}</div>
        </div>
      `;
      div.addEventListener('click', () => openChat(u.id));
      threadsList.appendChild(div);
    });
  }

  if(searchThreads){
    searchThreads.addEventListener('input', () => {
      const q = (searchThreads.value || '').toLowerCase().trim();
      if(!q){ renderThreads(threadsCache); return; }
      const filtered = threadsCache.filter(t => (t.user.username || '').toLowerCase().includes(q));
      renderThreads(filtered);
    });
  }

let mgPollTimer = null;

async function openChat(userId){
  activeChatUserId = userId;
    // ✅ habilita composer al abrir chat
  chatInput.disabled = false;
  sendBtn.disabled = false;
  chatEmpty.hidden = true;
  chatWrap.hidden = false;
  chatBody.innerHTML = `<div class="mg-empty">Cargando conversación...</div>`;

  try{
    const r = await api(`/api/messages/thread/${userId}/`);
    const other = r.other;
    chatName.textContent = other.username;
    chatAvatar.src = other.avatar || '/static/games/img/default_user.png';

    renderMessages(r.messages || []);
    chatBody.scrollTop = chatBody.scrollHeight;

    // ✅ al abrir chat, se marcan como leídos -> baja badge
    await refreshUnread();

    // ✅ polling SIEMPRE (tipo Messenger)
    if (mgPollTimer) clearInterval(mgPollTimer);
    mgPollTimer = setInterval(async () => {
      try{
        const rr = await api(`/api/messages/thread/${userId}/`);
        renderMessages(rr.messages || []);
        chatBody.scrollTop = chatBody.scrollHeight;
        await refreshUnread();
      }catch(e){}
    }, 1500);

  }catch(err){
    chatBody.innerHTML = `<div class="mg-empty">❌ ${err.message}</div>`;
  }
}

  function renderMessages(msgs){
    chatBody.innerHTML = '';
    if(!msgs.length){
      chatBody.innerHTML = `<div class="mg-empty">Aún no hay mensajes. ¡Escribe el primero!</div>`;
      return;
    }
    msgs.forEach(m => {
      const b = document.createElement('div');
      b.className = 'mg-bubble ' + (m.from_me ? 'me' : 'them');
      b.textContent = m.body;
      chatBody.appendChild(b);
    });
  }

  if(chatForm){
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if(!activeChatUserId) return;
      const body = (chatInput.value || '').trim();
      if(!body) return;
      chatInput.value = '';
      try{
        const r = await api(`/api/messages/thread/${activeChatUserId}/send/`, {method:'POST', body: JSON.stringify({body})});
        const m = r.message;
        const b = document.createElement('div');
        b.className = 'mg-bubble me';
        b.textContent = m.body;
        chatBody.appendChild(b);
        chatBody.scrollTop = chatBody.scrollHeight;
        await loadThreads();
        await refreshUnread();
      }catch(err){
        alert('No se pudo enviar: ' + err.message);
      }
    });
  }

  async function loadFriends(){
    if(!friendsList) return;
    friendsList.innerHTML = `<div class="mg-empty">Cargando...</div>`;
    try{
      const r = await api('/api/friends/');
      const list = r.friends || [];
      if(list.length === 0){
        friendsList.innerHTML = `<div class="mg-empty">No hay amigos.</div>`;
        return;
      }
      friendsList.innerHTML = '';
      list.forEach(u => {
        const div = document.createElement('div');
        div.className = 'mg-item';
        div.innerHTML = `
          <img class="mg-avatar" src="${u.avatar || '/static/games/img/default_user.png'}" alt="">
          <div class="mg-item__meta">
            <div class="mg-item__name">${escapeHtml(u.username)}</div>
            <div class="mg-item__last">${escapeHtml(u.email || '')}</div>
          </div>
        `;
        div.addEventListener('click', async () => {
          openPanel(messagesPanel);
          await loadThreads();
          await openChat(u.id);
        });
        friendsList.appendChild(div);
      });
    }catch(err){
      friendsList.innerHTML = `<div class="mg-empty">❌ ${err.message}</div>`;
    }
  }

  async function loadRequests(){
    if(!incomingBox || !outgoingBox) return;
    incomingBox.innerHTML = `<div class="mg-empty">Cargando...</div>`;
    outgoingBox.innerHTML = `<div class="mg-empty">Cargando...</div>`;
    try{
      const r = await api('/api/friends/requests/');

      if(!r.incoming || r.incoming.length === 0){
        incomingBox.innerHTML = `<div class="mg-empty">No tienes solicitudes.</div>`;
      }else{
        incomingBox.innerHTML = '';
        r.incoming.forEach(item => {
          const u = item.from_user;
          const row = document.createElement('div');
          row.className = 'mg-request';
          row.innerHTML = `
            <div class="mg-request__left">
              <img class="mg-avatar" src="${u.avatar || '/static/games/img/default_user.png'}" alt="">
              <div class="mg-item__meta">
                <div class="mg-item__name">${escapeHtml(u.username)}</div>
                <div class="mg-item__last">quiere agregarte</div>
              </div>
            </div>
            <div class="mg-request__actions">
              <button class="mg-btn mg-btn--ok" type="button">Aceptar</button>
              <button class="mg-btn mg-btn--no" type="button">Rechazar</button>
            </div>
          `;
          const [okBtn, noBtn] = row.querySelectorAll('button');
          okBtn.addEventListener('click', async () => {
            try{ await api(`/api/friends/request/${item.id}/accept/`, {method:'POST', body:'{}'}); await loadRequests(); await loadFriends(); }
            catch(e){ alert(e.message); }
          });
          noBtn.addEventListener('click', async () => {
            try{ await api(`/api/friends/request/${item.id}/decline/`, {method:'POST', body:'{}'}); await loadRequests(); }
            catch(e){ alert(e.message); }
          });
          incomingBox.appendChild(row);
        });
      }

      if(!r.outgoing || r.outgoing.length === 0){
        outgoingBox.innerHTML = `<div class="mg-empty">No has enviado solicitudes.</div>`;
      }else{
        outgoingBox.innerHTML = '';
        r.outgoing.forEach(item => {
          const u = item.to_user;
          const row = document.createElement('div');
          row.className = 'mg-request';
          row.innerHTML = `
            <div class="mg-request__left">
              <img class="mg-avatar" src="${u.avatar || '/static/games/img/default_user.png'}" alt="">
              <div class="mg-item__meta">
                <div class="mg-item__name">${escapeHtml(u.username)}</div>
                <div class="mg-item__last">pendiente</div>
              </div>
            </div>
          `;
          outgoingBox.appendChild(row);
        });
      }
    }catch(err){
      incomingBox.innerHTML = `<div class="mg-empty">❌ ${err.message}</div>`;
      outgoingBox.innerHTML = `<div class="mg-empty">❌ ${err.message}</div>`;
    }
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
      
  }
// ✅ ENTER envía (fallback si requestSubmit no existe)
if (chatInput && chatForm) {
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (typeof chatForm.requestSubmit === "function") {
        chatForm.requestSubmit();
      } else {
        // fallback viejo
        chatForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
  });
}

})();

