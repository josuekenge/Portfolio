import { useCallback, useMemo, useRef } from 'react';
import { isMine, isTerminal, marksForNode, MOBI_EDGES, MOBI_NODES, nodeId, systemEdges, tierLabel, type MapModel } from '../data/maps';
import type { LogoKey } from '../data/logos';
import { Tile } from './Logos';
import { usePauseOffscreen, useWires, type BandBox, type Pill, type Wire } from './wires';

function Layer({ wires, pills, band }: { wires: Wire[]; pills: Pill[]; band?: BandBox | null }) {
  return (
    <>
      <svg className="wires" aria-hidden="true">
        {wires.map((w, i) => (
          <g key={i}>
            <path className={w.realtime ? 'w rt' : 'w'} d={w.d} />
            <path className="beam" pathLength={100} d={w.d} style={{ '--b': w.color, animationDelay: w.delay } as React.CSSProperties} />
          </g>
        ))}
      </svg>
      {band && (
        <div className="mband" style={{ left: band.x, top: band.y, width: band.w, height: band.h }}>
          <span className="mbandl">{band.label}</span>
        </div>
      )}
      {pills.map((p) => (
        <span className="pill" key={`${p.text}${p.x}`} style={{ left: p.x, top: p.y }}>{p.text}</span>
      ))}
    </>
  );
}

function Node({ id, name, sub, marks, hot, style, className = '' }: { id: string; name: string; sub: string; marks: LogoKey[]; hot?: boolean; style?: React.CSSProperties; className?: string }) {
  return (
    <article className={`node ${hot ? 'hot' : ''} ${className}`} data-node={id} style={style}>
      <Tile marks={marks} />
      <div>
        <div className="nname">{name}</div>
        <div className="ndesc">{sub}</div>
      </div>
    </article>
  );
}

export function SystemMap({ model }: { model: MapModel }) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLElement>(null);
  usePauseOffscreen(frame);
  const getEdges = useCallback((compact: boolean) => systemEdges(model, compact), [model]);
  const band = useMemo(() => {
    if (!model.band) return undefined;
    return { from: nodeId(model, model.band.fromRow, 0), to: nodeId(model, model.band.toRow, 0), label: model.band.label };
  }, [model]);
  const { wires, pills, band: bandBox } = useWires(stage, getEdges, band);

  return (
    <figure className="map sr" ref={frame} aria-label={`${model.title} system map`}>
      <div className="maphead"><strong>System map</strong><span className="lab live"><i />{model.frame}</span></div>
      <div className="mstage" ref={stage}>
        <Layer wires={wires} pills={pills} band={bandBox} />
        {model.rows.map((nodes, r) => (
          <div className="mrow" key={r}>
            <div className="mtier">{tierLabel(nodes)}</div>
            <div className={`mnodes n${nodes.length}`}>
              {nodes.map((node, i) => (
                <Node key={node[1]} id={nodeId(model, r, i)} name={node[1]} sub={node[2]} marks={marksForNode(node)} hot={isTerminal(node[0])} className={isMine(node[0]) ? 'mine' : ''} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {model.rules && (
        <div className="rules">
          {model.rules.map((rule) => (
            <div key={rule.k}><div className="lab">{rule.k}</div><div className="rt1">{rule.t}</div><div className="rt2">{rule.d}</div></div>
          ))}
        </div>
      )}
      {model.foot && !model.rules && (
        <div className="mfoot"><div className="lab">{model.foot.k}</div><div className="rt2">{model.foot.v}</div></div>
      )}
    </figure>
  );
}

const mobiEdges = () => MOBI_EDGES;

export function MobiSoinsMap() {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLElement>(null);
  usePauseOffscreen(frame);
  const { wires, pills } = useWires(stage, mobiEdges);
  return (
    <figure className="map sr" ref={frame} aria-label="MobiSoins system map">
      <div className="maphead"><strong>MobiSoins</strong><span className="lab live"><i />Solid: request · Dotted: realtime</span></div>
      <div className="mstage" ref={stage}>
        <div className="m2w"><Layer wires={wires} pills={pills} /></div>
        <div className="mgrid">
          {MOBI_NODES.map((n) => (
            <Node key={n.id} id={n.id} name={n.name} sub={n.sub} marks={n.marks} className={`cellpos pos-${n.id}`} style={{ '--gc': n.gc, '--gr': n.gr } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </figure>
  );
}

/** The dense version used in the pinned panel beside the experience text. */
export function CompactMap({ model, active }: { model: MapModel; active: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const getEdges = useCallback((compact: boolean) => systemEdges(model, compact), [model]);
  const { wires } = useWires(stage, getEdges, undefined, true);
  return (
    <div className={`pm ${active ? 'on' : 'off'}`} aria-hidden={!active} data-map={model.title}>
      <div className="pmh"><span>{model.title}</span><span className="lab">{model.frame}</span></div>
      <div className={`pms ${model.rows.length > 5 ? 'tight' : ''}`} ref={stage}>
        <Layer wires={wires} pills={[]} />
        {model.rows.map((nodes, r) => (
          <div className={`prow r${nodes.length}`} key={r}>
            {nodes.map((node, i) => (
              <article className={`pn ${isTerminal(node[0]) ? 'hot' : ''} ${isMine(node[0]) ? 'mine' : ''}`} data-node={nodeId(model, r, i)} key={node[1]}>
                <Tile marks={marksForNode(node)} />
                <div className="pnt">
                  <div className="pt">{node[0]}</div>
                  <div className="pname">{node[1]}</div>
                  <div className="ps">{node[2]}</div>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
