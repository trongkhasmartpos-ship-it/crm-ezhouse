const CACHE_NAME='crm-ezhouse-push-v1';
self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim());});
self.addEventListener('push',event=>{
  let payload={};
  try{payload=event.data?event.data.json():{};}catch{payload={title:'CRM EZHOUSE',body:event.data?.text?.()||'Có thông báo mới',data:{url:'/'}};}
  const title=payload.title||'CRM EZHOUSE';
  const options={body:payload.body||'Có thông báo mới',icon:payload.icon||'/icon.svg',badge:payload.badge||'/icon.svg',data:payload.data||{url:'/'},tag:payload.tag||`ezhouse-${Date.now()}`,renotify:true,silent:payload.silent===true,vibrate:payload.silent===true?undefined:[160,80,160]};
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||'/',self.location.origin).href;
  event.waitUntil((async()=>{const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of list){try{const cu=new URL(client.url),tu=new URL(target);if(cu.origin===tu.origin){await client.focus();if('navigate' in client)await client.navigate(target);return;}}catch{}}if(self.clients.openWindow)return self.clients.openWindow(target);})());
});
