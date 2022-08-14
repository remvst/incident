let w = window;

let t;
let $;

let q;

_K = (a, b, c) => b < a ? a : (b > c ? c : b);
_i = (a, b, c) => a <= b && b <= c || a >= b && b >= c;
_J = (min, max) => random() * (max - min) + min;
_C = (x1, y1, x2, y2) => sqrt((x1 - x2)**2 + (y1 - y2)**2);
W = (a, b) => _C(a.x, a.y, b.x, b.y);
p = x => _B(x, PI);
K = (a, b) => atan2(b.y - a.y, b.x - a.x);
_I = (x, _h) => round(x / _h) * _h;
_H = a => a[~~(random() * a.length)];

// Modulo centered around zero: the result will be between -y and +y
_B = (x, y) => {
    x = x % (y * 2);
    if (x > y) {
        x -= y * 2;
    }
    if (x < -y) {
        x += y * 2;
    }
    return x;
};

// Make Math global
let _g = Math;
Object.getOwnPropertyNames(_g).forEach(n => w[n] = w[n] || _g[n]);

_G = PI * 2;

let _A = CanvasRenderingContext2D.prototype;

// A couple extra canvas functions
_A.J = function(f) {
    this.save();
    f();
    this.restore();
};

let _z = 1;

class Node {
    constructor(parent) {
        this.id = `n[${_z++}]`;

        this.position = {'x': 0, 'y': 0};
        this.m = {'x': 0, 'y': 0};

        this.l = 50;
        this.k = 70;

        this.I = Node.O;
        this.j = -Math.PI / 4;
        this.h = Math.PI / 4;

        this.children = [];

        if (parent) {
            this.parent = parent;
            this.parent.children.push(this);
        }

        this.X = () => {};
    }

    static O(s) {
        return s[~~(s.length / 2)];
    }

    static _y(s) {
        return s[0];
    }

    static _F(s) {
        return s[s.length - 1];
    }

    get g() {
        if (!this.parent) {
            return 0;
        }

        return p(K(this.position, this.parent.position));
    }

    _x() {
        if (!this.parent) return 0;
        let A = W(this.position, this.parent.position);
        return !_i(this.l, A, this.k);
    }

    _w() {
        if (!this.parent) return 0;
        let o = this.parent.g;
        if (o === 0) return 0;

        let V = p(this.g - o);

        if (!_i(p(this.j), V, p(this.h))) {
            return 1;
        }
    }

    _v() {
        // this._t();
    }

    _u() {
        let _f = K(this.position, this.parent.position);
        let _e = (this.l + this.k) / 2;

        let targetX = this.parent.position.x - _e * Math.cos(_f);
        let targetY = this.parent.position.y - _e * Math.sin(_f);

        this.position.x = targetX;
        this.position.y = targetY;

        this.children.forEach(_ => _._v());
    }

    _t() {
        let A = W(this.position, this.parent.position);
        let o = this.parent.g;
        let _s = (this.j + this.h) / 2;
        let _d = p(o + _s);
        let _c = p(o + this.j);
        let _b = p(o + this.h);

        let _r = {
            'x': this.parent.position.x + Math.cos(_c + Math.PI) * A,
            'y': this.parent.position.y + Math.sin(_c + Math.PI) * A,
        };

        let _q = {
            'x': this.parent.position.x + Math.cos(_b + Math.PI) * A,
            'y': this.parent.position.y + Math.sin(_b + Math.PI) * A,
        }

        let _p = {
            'x': this.parent.position.x + Math.cos(_d + Math.PI) * A,
            'y': this.parent.position.y + Math.sin(_d + Math.PI) * A,
        };

        let V = p(this.g - o);

        let s = [
            _r,
            _q,
            _p,
        ].sort((a, b) => {
            let _o = p(K(a, this.parent.position) - o) - V;
            let _n = p(K(b, this.parent.position) - o) - V;
            return Math.abs(_o) - Math.abs(_n);
        });

        // let resolutionOffsets = s.map((a) => {
        //     return p(K(a, this.parent.position) - o);
        // })

        let _a = this.I(s);
        
        this.position.x = _a.x;
        this.position.y = _a.y;

        let _E = p(this.g - o);
        // console.log('resolved g', V, _E, resolutionOffsets);

        // if (this.id === 'n[3]') throw new Error();
    }

    resolve() {
        // Resolve length elasticity
        if (this._x()) {
            this._u();
        }

        // Resolve g elasticity
        if (this._w()) {
            this._t();
        }
    }

    __() {
        this.m.x = this.position.x;
        this.m.y = this.position.y;
        for (let _ of this.children) {
            _.__();
        }
    }

    U(H) {
        let N = K(this.m, this.position);
        let _$ = W(this.m, this.position) * 0.2;
        
        this.m.x += _$ * Math.cos(N);
        this.m.y += _$ * Math.sin(N);

        this.resolve();

        for (let _ of this.children) {
            _.U(H);
        }
    }

    T() {
        $.J(() => {
            $.translate(this.m.x, this.m.y);

            $.fillStyle = '#f00';
            $.fillRect(-5, -5, 10, 10);

            if (this.parent) {
                $.lineWidth = 10;
                $.strokeStyle = '#fff';
                $.lineCap = 'round';
                $.beginPath();
                $.moveTo(0, 0);
                $.lineTo(this.parent.m.x - this.m.x, this.parent.m.y - this.m.y);
                $.stroke();
            }

            this.X();
        });

        $.J(() => {
            $.globalAlpha *= 0.5;
            this._m();
        });

        for (let _ of this.children) {
            $.J(() => _.T());
        } 
    }

    _m() {
        $.J(() => {
            $.translate(this.position.x, this.position.y);

            $.fillStyle = '#fff';
            // $.fillRect(-5, -5, 10, 10);

            if (this.parent) {
                $.lineWidth = 2;
                $.strokeStyle = '#fff'
                $.beginPath();
                $.moveTo(0, 0);
                $.lineTo(this.parent.position.x - this.position.x, this.parent.position.y - this.position.y);
                $.stroke();
            }

            let { g } = this;
            if (g) {
                let length = 30;

                $.lineWidth = 2;
                $.strokeStyle = '#f00'
                $.beginPath();
                $.moveTo(0, 0);
                $.lineTo(cos(this.g) * length, sin(this.g) * length);
                $.stroke();

                $.J(() => {
                    if (!this.parent || !this.parent.parent) return;
                    let o = this.parent.g;

                    $.lineWidth = 2;
                    $.strokeStyle = '#0f0'
                    $.beginPath();
                    $.moveTo(0, 0);
                    $.lineTo(Math.cos(this.h + this.parent.g) * length, Math.sin(this.h + this.parent.g) * length);
                    $.moveTo(0, 0);
                    $.lineTo(Math.cos(this.j + this.parent.g) * length, Math.sin(this.j + this.parent.g) * length);
                    $.stroke();
                });

                // if (this.id === 'n[4]') {
                //     // console.log(g);
                // }
            }

            $.fillStyle = '#fff';
            $.font = '12pt Arial';
            $.textAlign = 'left';
            $.textBaseline = 'bottom';
            $.fillText(this.id, 0, -10);
        });
    }
}


class _l {
    constructor() {
        this.G = {'x': 0, 'y': 0};

        this.head = new Node();
        this.head.position.x = 100;
        this.head.position.y = 100;

        // _D(this);
        _k(this);

        this.head.__();
    }
    
    U(H) {
        let _j = W(this.head.position, this.G);
        let N = K(this.head.position, this.G);
        let Z = Math.min(H * 100, _j);

        this.head.position.x += Math.cos(N) * Z;
        this.head.position.y += Math.sin(N) * Z;

        this.head.U(H);
        this.head.resolve();
    }

    T() {
        this.head.T();

        $.J(() => {
            $.fillStyle = '#f00';
            $.fillRect(this.G.x, this.G.y, 10, 10);
        });
    }
}

function _D(q) {
    let parent = q.head;
    let _;
    for (let i = 0 ; i < 10 ; i++)  {
        _ = new Node(parent);
        _.l = 30;
        _.k = 50;
        _.S = 100;
        _.I = Node._y;

        let v = new Node(_);
        v.j = Math.PI / 2 + Math.PI / 4;
        v.h = Math.PI / 2 - Math.PI / 4;
        v.l = 40;
        v.k = 60;
        v.S = 200;
        v.I = Node.O;
    
        let u = new Node(_);
        u.j = Math.PI * 3 / 2 + Math.PI / 4;
        u.h = Math.PI * 3 / 2 - Math.PI / 4;
        u.l = 40;
        u.k = 60;
        u.S = 200;
        u.I = Node.O;

        if (i % 4 === 0) {
            v.l *= 3;
            u.k *= 3;

            let F = new Node(v);
            F.j = Math.PI / 2 + Math.PI / 4;
            F.h = Math.PI / 2 - Math.PI / 4;
            F.l = 40;
            F.k = 60;
            F.S = 200;
            F.I = Node.O;

            let D = new Node(u);
            D.j = Math.PI * 3 / 2 + Math.PI / 4;
            D.h = Math.PI * 3 / 2 - Math.PI / 4;
            D.l = 40;
            D.k = 60;
            D.S = 200;
            D.I = Node.O;
        }

        parent = _;
    }
}

function _k(q) {
    let C = new Node(q.head);
    C.h = Math.PI / 8;
    C.j = -Math.PI / 8;
    C.l = 0;
    C.k = 5;

    let M = new Node(C);
    M.l = 50;
    M.k = 70;
    M.j = Math.PI / 2 - Math.PI / 8 + Math.PI / 8;
    M.h = Math.PI / 2 + Math.PI / 8 + Math.PI / 8;

    let L = new Node(C);
    L.l = 50;
    L.k = 70;
    L.j = -Math.PI / 2 - Math.PI / 8 - Math.PI / 8;
    L.h = -Math.PI / 2 + Math.PI / 8 - Math.PI / 8;

    let R = new Node(M);
    R.l = 30;
    R.k = 50;
    R.j = Math.PI / 2 - Math.PI / 8;
    R.h = Math.PI / 2 + Math.PI / 8;

    let B = new Node(L);
    B.l = 30;
    B.k = 50;
    B.j = -Math.PI / 2 - Math.PI / 8;
    B.h = -Math.PI / 2 + Math.PI / 8;

    q.head.X = () => {
        $.fillStyle = '#fff';
        $.beginPath();
        $.arc(0, 0, 20, 0, Math.PI * 2);
        $.fill();
    };

    B.X = () => {
        $.rotate(B.g + Math.PI);
        $.fillStyle = '#f00';
        $.fillRect(0, -5, 40, 10);
    };
}


onmousemove = (e) => {
    let P = t.getBoundingClientRect();
    q.G.x = (e.pageX - P.left) / P.width * t.width;
    q.G.y = (e.pageY - P.top) / P.height * t.height
};

window.addEventListener('load', () => {
    t = document.querySelector('canvas');
    t.width = 800;
    t.height = 800;

    $ = t.getContext('2d');

    q = new _l();
    frame();
});

let Y = performance.now();

function frame() {
    let now = performance.now();
    let H = (now - Y) / 1000;
    Y = now;

    q.U(H);

    clear();
    q.T();

    requestAnimationFrame(frame);
}

function clear() {
    $.fillStyle = '#000';
    $.fillRect(0, 0, t.width, t.height);
}

