"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff, LoaderCircle, UploadCloud } from "lucide-react";

type Resource = { id:string; title:string; description:string; type:"CLASS"|"NOTE"|"ANIMATION"|"RESOURCE"; subject:string; level:string; url:string; fileName:string; published:boolean; createdAt:string };
const empty = { title:"", description:"", type:"CLASS", subject:"General", level:"All levels", url:"", published:true };
export function AdminPanel({ initialResources }: { initialResources: Resource[] }) {
  const [resources, setResources] = useState(initialResources);
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  async function submit(e:FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      let resourceForm = { ...form };
      if (selectedFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "File upload failed.");
        resourceForm.url = uploadResult.url;
        setUploading(false);
      }
      const res = await fetch("/api/admin/resources", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(resourceForm) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create resource");
      setResources(old=>[data.resource,...old]); setForm(empty); setSelectedFile(null); setMessage("Resource created successfully."); router.refresh();
    } catch(err) { setMessage(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setBusy(false); setUploading(false); }
  }
  async function toggle(item:Resource) {
    const res = await fetch(`/api/admin/resources/${item.id}`, {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({published:!item.published})});
    const data=await res.json();
    if(res.ok) setResources(old=>old.map(r=>r.id===item.id?data.resource:r)); else setMessage(data.error||"Could not update resource.");
  }
  async function remove(id:string) {
    if(!window.confirm("Delete this resource? This cannot be undone.")) return;
    const res=await fetch(`/api/admin/resources/${id}`,{method:"DELETE"});
    if(res.ok) setResources(old=>old.filter(r=>r.id!==id)); else {const d=await res.json();setMessage(d.error||"Could not delete resource.");}
  }
  return <div className="admin-layout"><section className="admin-form-card"><div className="admin-card-heading"><div><span className="eyebrow">CONTENT STUDIO</span><h2><Plus size={19}/> Add a resource</h2></div></div><form className="admin-form" onSubmit={submit}>
    <label>Title<input required minLength={2} maxLength={150} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. JavaScript Fundamentals"/></label>
    <label>Description<textarea rows={3} maxLength={1000} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What will learners get from this resource?"/></label>
    <div className="form-row"><label>Type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value as typeof form.type})}><option value="CLASS">Video class</option><option value="NOTE">Notes</option><option value="ANIMATION">3D animation / lab</option><option value="RESOURCE">Other resource</option></select></label><label>Subject<input value={form.subject} maxLength={80} onChange={e=>setForm({...form,subject:e.target.value})}/></label></div>
    <div className="form-row"><label>Level<input value={form.level} maxLength={80} onChange={e=>setForm({...form,level:e.target.value})}/></label><label>Resource URL<input type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://…"/></label></div>
    <label>Or upload a file (PDF, video, image, or office document)
      <input type="file" accept=".pdf,.mp4,.webm,.mov,.png,.jpg,.jpeg,.webp,.ppt,.pptx,.doc,.docx,.txt" onChange={e=>setSelectedFile(e.target.files?.[0] || null)} />
    </label>
    {selectedFile && <p className="form-help">Selected: {selectedFile.name} · {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>}
    <label className="check-label"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publish immediately</label>
    {message && <p className="admin-message" role="status">{message}</p>}
    <button className="button button-primary button-large full-width" disabled={busy}>{busy?<LoaderCircle size={16} className="spin"/>:<Plus size={16}/>} {uploading ? "Uploading file…" : "Create resource"}</button>
    <p className="form-help"><UploadCloud size={13} style={{display:"inline",verticalAlign:"middle"}}/> Local uploads are limited to 100 MB and saved under public/uploads. For production, use private cloud storage.</p>
  </form></section>
  <section className="admin-resources"><div className="admin-card-heading"><div><span className="eyebrow">CONTENT LIBRARY</span><h2>Manage resources <span className="count-pill">{resources.length}</span></h2></div></div>
    {resources.length===0?<div className="empty-state">No resources yet. Add the first one.</div>:<div className="admin-resource-list">{resources.map(r=><article className="admin-resource-row" key={r.id}><div className="admin-resource-type">{r.type==="CLASS"?"▶":r.type==="NOTE"?"▤":r.type==="ANIMATION"?"◇":"↗"}</div><div className="admin-resource-copy"><b>{r.title}</b><span>{r.type} · {r.subject}</span><small className={r.published?"status-published":"status-draft"}>{r.published?"Published":"Draft"}</small></div><button className="icon-button" title={r.published?"Unpublish":"Publish"} onClick={()=>toggle(r)}>{r.published?<EyeOff size={17}/>:<Eye size={17}/>}</button><button className="icon-button danger" title="Delete resource" onClick={()=>remove(r.id)}><Trash2 size={17}/></button></article>)}</div>}
  </section></div>;
}
